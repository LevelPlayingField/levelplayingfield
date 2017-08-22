/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import MDSearch from 'react-icons/lib/io/android-search';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
import s from './Search.scss';
import SearchResult from './SearchResult';

import type { Result } from './Types';

const suggestedQueries = [
  'is:case',
  'filed:9/1/2010-9/30/2010',
  'is:attorney',
  'state:CA',
  'party:"Citibank, N.A."',
];
type Props = {
  query: string,
  results: Array<Result>,
  loading: bool,
  page: number,
  perPage: number,
  pages: number,
  updateQuery: (query: string) => void,
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

    history.push(`/search?q=${encodeURIComponent(this.input.value)}`, {
      search_query: this.input.value,
    });
  }

  render() {
    const { query, page, perPage, pages, results, loading } = this.props;

    return (
      <Layout>
        <Helmet
          title="Search - Level Playing Field"
          style={[{ type: 'text/css', cssText: s._getCss() }]}
        />
        <Container>
          <Row centerMd centerLg>
            <Col sm={12} md={8} lg={6}>
              <input
                className={s.searchField}
                onChange={e => this.props.updateQuery(e.target.value)}
                onBlur={() => this.setUrl()}
                onKeyDown={(e: KeyboardEvent) => e.keyCode === 13 && this.setUrl()}
                value={query}
                ref={input => { this.input = input; }}
              />
              <MDSearch className={s.searchIcon}/>
            </Col>
          </Row>

          <Row>
            <Col>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th className={s.cell1}>
                      Case
                    </th>
                    <th className={s.cell2}>
                      Plaintiff
                    </th>
                    <th className={s.cell3}>
                      Defendant
                    </th>
                    <th className={s.cell4}/>
                    <th className={s.cell5}>
                      Disposition
                    </th>
                    <th className={s.cell6}>
                      Filed
                    </th>
                  </tr>
                  <tr>
                    <th className={s.cell1}>
                      Dispute Type
                    </th>
                    <th className={s.cell2}>
                      Plaintiff Counsel
                    </th>
                    <th className={s.cell3}>
                      Defendant Counsel
                    </th>
                    <th className={s.cell4}>
                      Arbitrator
                    </th>
                    <th className={s.cell5}>
                      Awardee
                    </th>
                    <th className={s.cell6}>
                      Closed
                    </th>
                  </tr>
                </thead>

                {loading && (
                  <tbody>
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
                    </tr>
                  </tbody>
                )}

                {results && results.map((result: Result) =>
                  <SearchResult result={result} key={`result_${result.type}_${result.id}`}/>
                )}
              </table>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul className={s.pagination}>
                {/* Page 1, if gt page 1 */}
                <li>
                  {page > 1 ? (
                    <Link to={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
                      Last {perPage}
                    </Link>
                  ) : (
                    <span>Last {perPage}</span>
                  )}
                </li>

                <li><span>Page {page} of {pages}</span></li>

                <li>
                  {page < pages ? (
                    <Link to={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
                      Next {perPage}
                    </Link>
                  ) : (
                    <span>Next {perPage}</span>
                  )}
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

export default Search;
