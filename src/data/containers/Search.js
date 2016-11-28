/* @flow */
import React from 'react';
import Promise from 'bluebird';
import graphql from '../../core/graphql';

export type CaseType = {
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
export type PartyType = {
  id: number,
  slug: string,
  type: string,
  name: string,
  firms: Array<PartyType>,
  attorneys: Array<PartyType>,
}
export type Result = {
  id: number,
  type: string,
  slug: string,
  document: CaseType & PartyType,
}
type childProps = {
  onChange: (query: string) => void,
  results: Array<Result>,
}
type Props = {
  Component: ReactClass<childProps>,
  term: ?string,
};
type State = {
  query: string,
  results: Array<Result>,
  loading: bool,
};

export default class SearchContainer extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      query: props.term || '',
      results: [],
      loading: false,
    };
  }

  componentDidMount() {
    if (this.state.query) {
      this.searchFor(this.state.query);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.term && nextProps.term !== this.props.term) {
      this.setState({ query: nextProps.term }, () => {
        this.searchFor(this.state.query);
      });
    }
  }

  handleQueryChange(query: string) {
    this.setState({ query }, () => {
      this.searchFor(query);
    });
  }

  async searchFor(query: string) {
    await new Promise((resolve) => this.setState({ loading: true }, resolve));

    const results = await graphql(`    
    {
      Search(query: ${JSON.stringify(query)}) {
        id
        type
        slug
        document 
      }
    }
    `);

    this.setState({ results: results.Search, loading: false });
  }

  render() {
    const { Component } = this.props;

    return (
      <Component
        {...this.state}
        onChange={query => this.handleQueryChange(query)}
      />
    );
  }
}
