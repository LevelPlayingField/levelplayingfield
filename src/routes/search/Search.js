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
  loading: bool,
}
class Search extends React.Component {
  props: Props;
  input: HTMLInputElement;

  static contextTypes = {
    history: React.PropTypes.any.isRequired,
  };

  componentDidMount() {
    if (!this.props.query) {
      this.input.focus();
    }
  }

  setUrl() {
    const { history } = this.context;

    history.push(`/search/${this.input.value}`);
  }

  render() {
    const { onChange, query, results, loading } = this.props;

    return (
      <Layout>
        <div className={s.container}>
          <div className={s.queryRow}>
            <MDSearch className={s.searchIcon}/>
            <input
              className={s.searchField}
              onChange={e => onChange(e.target.value)}
              onBlur={() => this.setUrl()}
              onKeyDown={(e: KeyboardEvent) => e.keyCode === 13 && this.setUrl()}
              value={query}
              ref={input => { this.input = input; }}
            />
          </div>

          <div className={s.row}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th className={s.cell1}>Case</th>
                  <th className={s.cell2}>Plaintiff</th>
                  <th className={s.cell3}>Defendant</th>
                  <th className={s.cell4}/>
                  <th className={s.cell5}>Disposition</th>
                  <th className={s.cell6}>Filed</th>
                </tr>
                <tr>
                  <th className={s.cell1}>Dispute Type</th>
                  <th className={s.cell2}>Plaintiff Counsel</th>
                  <th className={s.cell3}>Defendant Counsel</th>
                  <th className={s.cell4}>Arbitrator</th>
                  <th className={s.cell5}>Prevailing Party</th>
                  <th className={s.cell6}>Closed</th>
                </tr>
              </thead>

              {loading && (
                <tbody>
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
                  </tr>
                </tbody>
              )}

              {results.map((result: Result) =>
                <SearchResult result={result} key={`result_${result.type}_${result.id}`}/>
              )}
            </table>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Search);
