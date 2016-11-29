/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/md/search';
import searchQuery from 'search-query-parser';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import s from './Search.scss';
import SearchResult from './SearchResult';

import type { Result } from '../../data/containers/Search';

type Props = {
  onChange: (query: string) => null,
  query: string,
  results: Array<Result>,
  loading: bool,
  page: number,
  pages: number,
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

  handleChange(e) {
    const { onChange } = this.props;
    const value = e.target.value;
    const parsed = searchQuery.parse(value, {
      keywords: [
        'is',
        'board',
        'party',
      ],
      groups: {
        is: [
          ['case', 'party'],
        ],
      },
      ranges: [
        'filed',
        'closed',
      ],
    });

    onChange(value);
  }

  render() {
    const { page, pages, query, results, loading } = this.props;

    return (
      <Layout>
        <div className={s.container}>
          <div className={s.queryRow}>
            <MDSearch className={s.searchIcon}/>
            <input
              className={s.searchField}
              onChange={e => this.handleChange(e)}
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
                  <th className={s.cell5}>Awardee</th>
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

              <tfoot>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    <ul className={s.pagination}>
                      {/* Page 1, if gt page 1 */}
                      {page > 1 && <li><Link to={`/search/${query}?page=1`}>1</Link></li>}

                      {/* At most 5 previous pages and 10 next pages */}
                      {Array.from(new Array(15).keys())
                        .map(v => (v - 5) + page)
                        .filter(v => v >= 1 && v <= pages)
                        .map(v => (
                          v === page
                            ? <li><span>{v}</span></li>
                            : <li><Link to={`/search/${query}?page=${v}`}>{v}</Link></li>
                        ))}

                      {page < pages && (
                        <li><Link to={`/search/${query}?page=${pages}`}>{pages}</Link></li>
                      )}
                    </ul>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Search);
