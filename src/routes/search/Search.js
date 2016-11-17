/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/md/search';
import Layout from '../../components/Layout';

import s from './Search.scss';
import SearchResult from './SearchResult';

import type { Result } from '../../data/containers/Search';

type Props = {
  onChange: (query: string) => null,
  query: string,
  results: Array<Result>,
}
class Search extends React.Component {
  props: Props;
  input: HTMLInputElement;

  componentDidMount() {
    this.input.focus();
  }

  render() {
    const { onChange, query, results } = this.props;

    return (
      <Layout>
        <div className={s.container}>
          <div className={s.queryRow}>
            <MDSearch className={s.searchIcon}/>
            <input
              className={s.searchField}
              onChange={e => onChange(e.target.value)}
              value={query}
              ref={input => { this.input = input; }}
            />
          </div>
          <ul>
            {results.map((result: Result) =>
              <SearchResult result={result} key={`result_${result.type}_${result.id}`}/>
            )}
          </ul>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Search);
