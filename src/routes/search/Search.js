/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import MDSearch from 'react-icons/lib/io/android-search';
import Spinner from 'react-icons/lib/io/load-d';
import SortUp from 'react-icons/lib/io/chevron-up';
import SortDown from 'react-icons/lib/io/chevron-down';
import cx from 'classnames';
import qs from 'query-string';

import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Col, Container, Row } from '../../components/Grid';

import s from './Search.scss';
import SearchResult from './SearchResult';

import type { Result } from './Types';

const typeRegex = /\bis:(case|party)\b\s?/;

type Props = {
  query: string,
  results: Array<Result>,
  loading: bool,
  sortBy: string,
  sortDir: 'ASC' | 'DESC',
  urlArgs: { [key: string]: string },
  page: number,
  perPage: number,
  pages: number,
  updateQuery: (query: string) => void,
}
type SortableProps = {
  sortKey: string,
  curSort: string,
  curDir: string,
  urlArgs: { [key: string]: string },
  children: any,
};
const Sortable = ({ sortKey, urlArgs: { sortBy = '', sortDir = '', ...urlArgs }, children, ...props }: SortableProps) => {
  const url = `/search?${qs.stringify({
    ...urlArgs,
    sortBy: sortKey,
    sortDir: sortBy === sortKey && sortDir === 'DESC' ? 'ASC' : 'DESC',
  })}`;

  return (
    <Link to={url} {...props} className={s.Sortable}>
      {children}
      {sortBy === sortKey && (sortDir === 'DESC'
          ? <SortDown/>
          : <SortUp/>
      )}
    </Link>
  );
};

class Search extends React.Component {
  props: Props;
  state: {
    USE_CASEPARTY_SELECT: bool
  };
  input: HTMLInputElement;

  static contextTypes = {
    history: PropTypes.any.isRequired,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      USE_CASEPARTY_SELECT: false,
    };
  }

  componentDidMount() {
    if (!this.props.query) {
      this.input.focus();
    }
  }

  setUrl(type: string) {
    const { history } = this.context;
    const query = qs.stringify({
      q: `is:${type} ${this.input.value}`,
      sortBy: this.props.sortBy,
      sortDir: this.props.sortDir,
    });

    history.push(`/search?${query}`, {
      search_query: this.input.value,
    });
  }

  renderThead(type: string) {
    const { urlArgs } = this.props;

    if (type === 'case') {
      return (
        <thead>
          <tr>
            <th className={s.cell1} style={{ width: '10%' }}>
              <Sortable sortKey="case_number" urlArgs={urlArgs}>Case</Sortable>
            </th>
            <th className={s.cell2}>Plaintiff</th>
            <th className={s.cell3}>Defendant</th>
            <th className={s.cell4}/>
            <th className={s.cell5} style={{ width: '9%' }}>
              <Sortable sortKey="type_of_disposition" urlArgs={urlArgs}>Disposition</Sortable>
            </th>
            <th className={s.cell6} style={{ width: '7%' }}>
              <Sortable sortKey="filing_date" urlArgs={urlArgs}>Filed</Sortable>
            </th>
          </tr>
          <tr>
            <th className={s.cell1}>
              <Sortable sortKey="dispute_type" urlArgs={urlArgs}>Dispute Type</Sortable>
            </th>
            <th className={s.cell2}>Plaintiff Counsel</th>
            <th className={s.cell3}>Defendant Counsel</th>
            <th className={s.cell4}>Arbitrator</th>
            <th className={s.cell5}>
              <Sortable sortKey="prevailing_party" urlArgs={urlArgs}>Awardee</Sortable>
            </th>
            <th className={s.cell6}>
              <Sortable sortKey="close_date" urlArgs={urlArgs}>Closed</Sortable>
            </th>
          </tr>
        </thead>
      );
    } else {
      return (
        <thead>
          <tr>
            <th className={s.cell1} style={{ width: '15%' }}>Type</th>
            <th className={s.cell2} style={{ width: '35%' }}>
              <Sortable sortKey="name" urlArgs={urlArgs}>Name</Sortable>
            </th>
            <th className={s.cell3} style={{ width: '40%' }}>Firm/Attorneys</th>
            <th className={s.cell4} style={{ width: '10%' }}>
              <Sortable sortKey="case_count" urlArgs={urlArgs}>Case Count</Sortable>
            </th>
          </tr>
        </thead>
      );
    }
  }

  render() {
    const { query, page, perPage, sortBy, sortDir, pages, results, loading } = this.props;
    const reMatch = query.match(typeRegex);
    const type = reMatch == null ? 'case' : reMatch[1];
    const parsedQuery = query.replace(typeRegex, '');
    const setSearch = (type: string) => {
      this.props.updateQuery(`is:${type} ${parsedQuery}`);
      this.setUrl(type);
    };

    return (
      <Layout>
        <Helmet
          title="Search - Level Playing Field"
          style={[{ type: 'text/css', cssText: s._getCss() }]}
        />
        <Container>
          <Row centerMd centerLg>
            <Col sm={12} md={8} lg={6} className={s.centerText}>
              {this.state.USE_CASEPARTY_SELECT ? (
                <select
                  value={type}
                  className={s.selectField}
                  onChange={e => {
                    this.props.updateQuery(
                      `is:${e.target.value} ${parsedQuery}`);
                    this.setUrl(e.target.value);
                  }}
                >
                  <option value="case">Cases</option>
                  <option value="party">Parties</option>
                </select>
              ) : (
                <span>
                  <button
                    className={cx(s.toggleButton, type === 'case' && s.toggleButtonActive)}
                    onClick={() => setSearch('case')}
                  >
                    Case
                  </button>
                  <button
                    className={cx(s.toggleButton, type === 'party' && s.toggleButtonActive)}
                    onClick={() => setSearch('party')}
                  >
                    Party
                  </button>
                </span>
              )}
              <input
                className={s.searchField}
                onChange={e => this.props.updateQuery(
                  `is:${type} ${e.target.value}`)}
                onBlur={() => this.setUrl(type)}
                onKeyDown={(e: KeyboardEvent) => e.keyCode === 13 &&
                  this.setUrl(type)}
                value={parsedQuery}
                ref={input => {
                  this.input = input;
                }}
              />
              <MDSearch className={s.searchIcon}/>
            </Col>
          </Row>

          <Row>
            <Col>
              <table className={s.table}>
                {this.renderThead(type)}

                {loading && (
                  <tbody className={s.tbodyLoading}>
                    <tr>
                      <td colSpan="6">
                        Loading...
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6">
                        <Spinner size={32} className={s.rotateIcon}/>
                      </td>
                    </tr>
                  </tbody>
                )}
                {results && results.map((result: Result) =>
                  <SearchResult
                    result={result}
                    key={`result_${result.type}_${result.id}`}
                  />,
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
                    <Link
                      to={`/search?${qs.stringify({
                        q: query,
                        page: page - 1,
                        sortBy,
                        sortDir,
                      })}`}
                    >
                      Last {perPage}
                    </Link>
                  ) : (
                    <span>Last {perPage}</span>
                  )}
                </li>

                <li><span>Page {page} of {pages}</span></li>

                <li>
                  {page < pages ? (
                    <Link
                      to={`/search?${qs.stringify({
                        q: query,
                        page: page + 1,
                        sortBy,
                        sortDir,
                      })}`}
                    >
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
