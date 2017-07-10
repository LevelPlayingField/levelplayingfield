/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
import s from './Search.scss';
import graphql from '../../core/graphql';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import SearchPagination from './SearchPagination';

import type { Result } from './Types';

type Props = {
  query?: string,
  page: number,
  perPage: number,
  sortBy?: string,
  sortDir?: string,
  results?: Array<Result>,
}
type State = {
  query: string,
  page: number,
  loading: bool,
  results: [],
};

function debounce(delay: number) {
  let timeout;

  return (target, key, descriptor) => {
    const func = descriptor.value;

    descriptor.value = function() {
      const later = () => {
        timeout = null;

        func.apply(this, arguments);
      }
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
    }

    return descriptor;
  }
}

const suggestedQueries = [
  'is:case',
  'filed:9/1/2010-9/30/2010',
  'is:attorney',
  'state:CA',
  'party:"Citibank, N.A."',
];

class SearchContainer extends React.Component {
  state: State;
  props: Props;
  
  static defaultProps = {
    perPage: 20,
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      page: props.page,
      query: props.query || '',
      results: props.results || [],
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.query !== nextProps.query) {
      console.log(this.props.query, nextProps.query);
      this.setState({
        query: nextProps.query,
        page: nextProps.page,
      }, () => {
        this.updateResults();
      });
    }
  }

  handleQueryChange(query: string) {
    if (this.state.query !== query) {
      this.setState({ query, page: 1 }, () => {
        this.updateResults();
      });
    }
  }

  updateResults() {
    const { query, page } = this.state;

    this.getResults(query, page);
  }

  @debounce(130)
  async getResults(query: string, page: number = 1) {
    await new Promise(resolve => this.setState({ loading: true }, resolve));

    const { perPage = 20 } = this.props;
    const { Search: { Results } } = await graphql(`
    { Search(query: ${JSON.stringify(query)}) {
        Results(page: ${page}, perPage: ${perPage}) {
          page
          pages
          total
          
          edges {
            node {
              id
              type
              slug
              document
    } } } } } 
    `);;

    this.setState({
      results: Results.edges.map(edge => edge.node),
      loading: false,
    });
  }

  render() {
    const { Component, ...props } = this.props;
    const { results, query, page, pages, perPage, loading } = this.state;

    return (
      <Layout>
        <Helmet
          title="Search - Level Playing Field"
          style={[{ type: 'text/css', cssText: s._getCss() }]}
        />
        <Container>
          <SearchInput 
            query={query} 
            onChange={v => { this.handleQueryChange(v) }}
          />

          <Row centerMd centerLg>
            <Col>
              <small>
                Try these useful search queries:
                {suggestedQueries.map((q, i) => (
                  <span key={q}>
                    &nbsp;
                    <Link to={`/search?q=${encodeURIComponent(q)}`}>{q}</Link>
                    {i < suggestedQueries.length - 1 && ','}
                  </span>
                ))}
              </small>
            </Col>
          </Row>

          <SearchResults loading={loading} results={results} />
          <SearchPagination page={page} pages={pages} perPage={perPage} query={query} />
        </Container>
      </Layout>
    );
  }
}

export default SearchContainer;
