/* @flow */

export type ActionParams = {
  params: {
    term?: string,
  },
  query: {
    q?: string,
    page?: number,
    perPage?: number,
    sortBy?: string,
    sortDir?: 'ASC' | 'DESC',
  },
};

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
  case_count: number,
  firms: Array<PartyType>,
  attorneys: Array<PartyType>,
  aggregate_data: {[key:string]: {[key:string]: {[key:string]: number}}}
}
export type Result = {
  id: number,
  type: string,
  slug: string,
  document: CaseType & PartyType,
}
