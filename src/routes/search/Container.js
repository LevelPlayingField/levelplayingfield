/* @flow */

import React from 'react';
import graphql from '../../core/graphql';
import type { Result } from './Types';
import SearchQuery from './SearchQuery.graphql';

type Props = {
  Component: any,
  query?: string,
  page: number,
  pages: number,
  perPage: number,
  sortBy?: string,
  sortDir?: "DESC" | "ASC",
  serverRendered?: bool,
  results?: Array<Result>,
}
type State = {
  query: string,
  page: number,
  pages: number,
  sortBy?: string,
  sortDir?: "DESC" | "ASC",
  loading: bool,
  results: [],
};

function debounce(delay: number) {
  let timeout;

  return (target, key, descriptor) => {
    const func = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function debounced(...args) {
      const later = () => {
        timeout = null;

        func.apply(this, ...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
    };

    return descriptor;
  };
}

class Container extends React.Component {
  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      page: props.page,
      pages: props.pages,
      query: props.query || '',
      results: props.results || [],
    };
  }

  componentWillMount() {
    if (!this.props.serverRendered) {
      this.updateResults();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const cb = () => this.updateResults();

    if (this.state.query !== nextProps.query
      || this.state.sortBy !== nextProps.sortBy
      || this.state.sortDir !== nextProps.sortDir) {
      this.setState({
        query: nextProps.query,
        sortBy: nextProps.sortBy,
        sortDir: nextProps.sortDir,
        page: nextProps.page,
        results: nextProps.results,
      }, cb);
    } else if (nextProps.page && this.state.page !== nextProps.page) {
      this.setState({
        page: nextProps.page,
      }, cb);
    }
  }

  handleQueryChange(query: string) {
    if (this.state.query !== query) {
      this.setState({ query, page: 1 }, () => {
        this.updateResults();
      });
    }
  }

  @debounce(150)
  updateResults() {
    const { query, page } = this.state;

    this.getResults(query, page);
  }

  async getResults(query: string, page: number = 1) {
    await new Promise(resolve => this.setState({ loading: true }, resolve));

    const { perPage, sortBy, sortDir } = this.props;
    const { Search: { Results } } = await graphql(SearchQuery, {
      query,
      perPage,
      page,
      sortBy,
      sortDir,
    });

    this.setState({
      results: Results.edges.map(edge => edge.node),
      page: Results.page,
      pages: Results.pages,
      loading: false,
    });
  }

  render() {
    const { Component, ...props } = this.props;
    const { results, query, page, pages, loading } = this.state;

    return (
      <Component
        {...props}
        page={page}
        pages={pages}
        updateQuery={(q: string) => this.handleQueryChange(q)}
        query={query}
        results={results}
        loading={loading}
      />
    );
  }
}

export default Container;
