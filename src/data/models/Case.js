/* @flow */
import DataType from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('case', {
  case_number: DataType.STRING(24),
  arbitration_board: DataType.STRING,
  initiating_party: DataType.STRING,
  source_of_authority: DataType.STRING,
  dispute_type: DataType.STRING,
  dispute_subtype: DataType.STRING,
  salary_range: DataType.STRING,
  prevailing_party: DataType.STRING,
  filing_date: DataType.DATE,
  close_date: DataType.DATE,
  type_of_disposition: DataType.STRING,

  claim_amount_business: DataType.BIGINT,
  fee_allocation_business: DataType.NUMERIC(5, 2),
  fees_business: DataType.BIGINT,
  award_amount_business: DataType.INTEGER,
  attorney_fees_business: DataType.INTEGER,
  other_relief_business: DataType.STRING,

  claim_amount_consumer: DataType.BIGINT,
  fee_allocation_consumer: DataType.NUMERIC(5, 2),
  fees_consumer: DataType.BIGINT,
  award_amount_consumer: DataType.INTEGER,
  attorney_fees_consumer: DataType.INTEGER,
  other_relief_consumer: DataType.STRING,

  consumer_rep_state: DataType.STRING,
  consumer_self_represented: DataType.BOOLEAN,
  document_only_proceeding: DataType.BOOLEAN,
  type_of_hearing: DataType.STRING,
  hearing_addr1: DataType.STRING,
  hearing_addr2: DataType.STRING,
  hearing_city: DataType.STRING,
  hearing_state: DataType.STRING,
  hearing_zip: DataType.STRING,
  arb_count: DataType.INTEGER,
  med_count: DataType.INTEGER,
  arb_or_cca_count: DataType.INTEGER,
  adr_process: DataType.STRING(255),
}, {
  indexes: [
    { fields: ['id'] },
    { fields: ['case_number'] },
  ],
});
