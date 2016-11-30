/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/md/search';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
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

    onChange(value);
  }

  render() {
    const { page, pages, query, results, loading } = this.props;

    return (
      <Layout>
        <Container>
          <Row centerMd centerLg>
            <Col sm={12} md={6} lg={4}>
              <MDSearch className={s.searchIcon}/>
              <input
                className={s.searchField}
                onChange={e => this.handleChange(e)}
                onBlur={() => this.setUrl()}
                onKeyDown={(e: KeyboardEvent) => e.keyCode === 13 && this.setUrl()}
                value={query}
                ref={input => { this.input = input; }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
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
              </table>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul className={s.pagination}>
                {/* Page 1, if gt page 1 */}
                <li>
                  {page > 1 ? (
                    <Link to={`/search/${query}?page=${page - 1}`}>Last 10</Link>
                  ) : (
                    <span>Last 10</span>
                  )}
                </li>

                <li><span>Page {page} of {pages}</span></li>

                <li>
                  {page < pages ? (
                    <Link to={`/search/${query}?page=${page + 1}`}>Next 10</Link>
                  ) : (
                    <span>Next 10</span>
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

export default withStyles(s)(Search);
