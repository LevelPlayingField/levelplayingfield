import DataType from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('case', {
  case_number:               DataType.STRING(24),
  initiating_party:          DataType.STRING,
  source_of_authority:       DataType.STRING,
  dispute_type:              DataType.STRING,
  dispute_subtype:           DataType.STRING,
  salary_range:              DataType.STRING,
  prevailing_party:          DataType.STRING,
  filing_date:               DataType.DATE,
  close_date:                DataType.DATE,
  type_of_disposition:       DataType.STRING,
  business_fees:             DataType.BIGINT,
  consumer_fees:             DataType.BIGINT,
  feeallocation_consumer:    DataType.NUMERIC(5, 2),
  feeallocation_business:    DataType.NUMERIC(5, 2),
  award_amount_consumer:     DataType.INTEGER,
  award_amount_business:     DataType.INTEGER,
  other_relief_consumer:     DataType.STRING,
  other_relief_business:     DataType.STRING,
  attorney_fees_consumer:    DataType.INTEGER,
  attorney_fees_business:    DataType.INTEGER,
  consumer_rep_state:        DataType.STRING,
  consumer_self_represented: DataType.BOOLEAN,
  document_only_proceeding:  DataType.BOOLEAN,
  type_of_hearing:           DataType.STRING,
  hearing_addr1:             DataType.STRING,
  hearing_addr2:             DataType.STRING,
  hearing_city:              DataType.STRING,
  hearing_state:             DataType.STRING,
  hearing_zip:               DataType.STRING,
  arb_count:                 DataType.INTEGER,
  med_count:                 DataType.INTEGER,
  consumer_arb_count:        DataType.INTEGER,
  adr_process:               DataType.STRING(255),
}, {
  indexes: [
    { fields: ['id'] },
    { fields: ['case_number'] },
  ]
});
