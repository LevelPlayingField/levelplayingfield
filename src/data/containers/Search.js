/* @flow */
import React from 'react';
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
}
export type PartyType = {
  id: number,
  slug: string,
  type: string,
  name: string,
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
};
type State = {
  query: string,
  results: Array<Result>
};

export default class SearchContainer extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      query: '',
      results: [],
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleQueryChange(query: string) {
    this.setState({ query }, () => {
      this.searchFor(query);
    });
  }

  async searchFor(query: string) {
    const results = await graphql(`
    fragment PartyFields on Party {
      id
      slug
      type
      name
    }
    
    fragment CaseFields on case {
      id
      case_number
      arbitration_board
      initiating_party
      source_of_authority
      dispute_type
      dispute_subtype
      salary_range
      prevailing_party
      filing_date
      close_date
      type_of_disposition
      claim_amount_business
      fee_allocation_business
      fees_business
      award_amount_business
      attorney_fees_business
      other_relief_business
      claim_amount_consumer
      fee_allocation_consumer
      fees_consumer
      award_amount_consumer
      attorney_fees_consumer
      other_relief_consumer
      consumer_rep_state
      consumer_self_represented
      document_only_proceeding
      type_of_hearing
      hearing_addr1
      hearing_addr2
      hearing_city
      hearing_state
      hearing_zip
      arb_count
      med_count
      arb_or_cca_count
      adr_process
    }
    
    {
      Search(query: "${query}") {
        id
        type
        slug
        document {
          ... on case {
            ...CaseFields
          }
          ... on Party {
            ...PartyFields
          }
        }
      }
      Summary {
        cases
        parties
      }
    }
    `);

    this.setState({ results: results.Search });
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
