import type { SerializeFrom } from "@remix-run/node";
import type { PartyType } from "./PartySearch";

export type State = string;

export type CaseDocument = {
  id: string;
  names: string[];
  case_id: number;
  unique_value: string;

  arb_count: number;
  med_count: null | number;
  close_date: Date;
  created_at: Date;
  updated_at: Date;
  adr_process: null | string;
  case_number: string;
  filing_date: Date;
  import_date: Date;
  normal_type: string;
  dispute_type: string;
  salary_range: null | string;
  fees_business: number;
  fees_consumer: number;
  dispute_subtype: string;
  type_of_hearing: null | string;
  arb_or_cca_count: null | number;
  initiating_party: string;
  prevailing_party: string;
  arbitration_board: string;
  consumer_rep_state: null | State;
  source_of_authority: string;
  type_of_disposition: string;

  award_amount_business: null | number;
  award_amount_consumer: null | number;
  claim_amount_business: null | number;
  claim_amount_consumer: null | number;
  other_relief_business: null | number | string;
  other_relief_consumer: null | number;
  attorney_fees_business: null | number;
  attorney_fees_consumer: null | number;
  fee_allocation_business: null | number;
  fee_allocation_consumer: null | number;

  hearing_addr1: null | string;
  hearing_addr2: null | string;
  hearing_city: null | string;
  hearing_state: null | State;
  hearing_zip: null | string;

  document_only_proceeding: boolean;
  consumer_self_represented: boolean;

  parties: Array<{
    case_id: string;

    party_id: number;
    type: PartyType;
    party_name: string;
    party_slug: string;

    date: null | Date;
    fees: null | number;

    firm_id: null | number;
    firm_name: null | string;
    firm_slug: null | string;

    created_at: Date;
    updated_at: Date;
  }>;
};
