/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/md/search';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
import s from './Search.scss';
import SearchResult from './SearchResult';

type CaseType = {
  case_number: string,
  arbitration_board: string,
  initiating_party: string,
  source_of_authority: string,
  dispute_type: string,
  dispute_subtype: string,
  salary_range: string,
  prevailing_party: string,
  filing_date: Date,
  close_date: Date,
  type_of_disposition: string,
  claim_amount_business: number,
  fee_allocation_business: number,
  fees_business: number,
  award_amount_business: number,
  attorney_fees_business: number,
  other_relief_business: string,
  claim_amount_consumer: number,
  fee_allocation_consumer: number,
  fees_consumer: number,
  award_amount_consumer: number,
  attorney_fees_consumer: number,
  other_relief_consumer: string,
  consumer_rep_state: string,
  consumer_self_represented: bool,
  document_only_proceeding: bool,
  type_of_hearing: string,
  hearing_addr1: string,
  hearing_addr2: string,
  hearing_city: string,
  hearing_state: string,
  hearing_zip: string,
  arb_count: number,
  med_count: number,
  arb_or_cca_count: number,
  adr_process: string,
  party_names: Array<string>,
  parties: Array<{
    type: string,
    case_id: number,
    party_id: number,
    firm_id: number,
    party_name: string,
    firm_name: string,
    fees: ?number,
    date: string,
    createdAt: string,
    updatedAt: string,
  }>,
}
type PartyType = {
  id: number,
  slug: string,
  type: string,
  name: string,
  firms: Array<PartyType>,
  attorneys: Array<PartyType>,
}
type Result = {
  id: number,
  type: string,
  slug: string,
  document: CaseType & PartyType,
}
type Props = {
  query: string,
  results: Array<Result>,
  loading: bool,
  page: number,
  perPage: number,
  pages: number,
}
type State = {
  query: string,
};
class Search extends React.Component {
  props: Props;
  state: State;
  input: HTMLInputElement;

  static contextTypes = {
    history: React.PropTypes.any.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      query: props.query,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.query !== nextProps.query) {
      this.setState({ query: nextProps.query });
    }
  }

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
    const { query } = this.state;
    const { page, pages, results, loading } = this.props;

    return (
      <Layout>
        <Container>
          <Row centerMd centerLg>
            <Col sm={12} md={6} lg={4}>
              <MDSearch className={s.searchIcon}/>
              <input
                className={s.searchField}
                onChange={e => this.setState({ query: e.target.value })}
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
