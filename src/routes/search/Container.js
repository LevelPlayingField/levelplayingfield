/* @flow */

import React from 'react';
import graphql from '../../core/graphql';

import type { Result } from './Types';

type Props = {
  Component: any,
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

class Container extends React.Component {
  state: State;
  props: Props;

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
    if (this.props.query !== nextProps.query || this.props.results !== nextProps.results) {
      this.setState({
        query: nextProps.query,
        page: nextProps.page,
        results: nextProps.results,
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

  async getResults(query: string, page: number = 1) {
    await new Promise(resolve => this.setState({ loading: true }, resolve));

    const { perPage } = this.props;
    const { Search: { Results } } = await graphql(`
    {
      Search(query: ${JSON.stringify(query)}) {
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
            }
          }
        }
      }
    }
    `);

    this.setState({
      results: Results.edges.map(edge => edge.node),
      loading: false,
    });
  }

  render() {
    const { Component, ...props } = this.props;
    const { results, query } = this.state;

    return (
      <Component
        {...props}
        updateQuery={(q: string) => this.handleQueryChange(q)}
        query={query}
        results={results}
      />
    );
  }
}

export default Container;
