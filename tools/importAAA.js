/* @flow */

import { Case, Party, CaseParty } from '../src/data/models';
import utils, { buildUniqueValue, createParty, runImport, validateCaseData } from './lib/importlib';

async function parseRow(row: {[key: string]: any}, importDate: string): any {
  const {
    CASE_ID,
    NONCONSUMER,
    INITIATING_PARTY,
    SOURCE_OF_AUTHORITY,
    TYPEDISPUTE,
    DISPUTE_SUBTYPE,
    SALARY_RANGE,
    PREVAILING_PARTY,
    FILING_DATE,
    CLOSEDATE,
    TYPE_OF_DISPOSITION,
    CLAIM_AMT_BUSINESS,
    CLAIM_AMT_CONSUMER,
    FEEALLOCATION_CONSUMER,
    FEEALLOCATION_BUSINESS,
    AWARD_AMT_BUSINESS,
    AWARD_AMT_CONSUMER,
    OTHERRELIEF_BUSINESS,
    OTHERRELIEF_CONSUMER,
    ATTORNEYFEE_BUSINESS,
    ATTORNEYFEE_CONSUMER,
    CONSUMER_REP_STATE,
    CONSUMER_SELF_REPRESENTED,
    DOCUMENT_ONLY_PROCEEDING,
    TYPE_OF_HEARING,
    HEARING_ADDR1,
    HEARING_ADDR2,
    HEARING_CITY,
    HEARING_STATE,
    HEARING_ZIP,
    NO_OF_CASES_INVOLVING_BUSINESS,
    NO_OF_MEDCASES_NONCONS,
    NO_OF_ARBORCCACASES_NONCONS,
    ADR_PROCESS,

    // Arbitrator fields
    ARBITRATOR_NAME,
    APPOINTMENT_DATE,
    TOTAL_FEE,

    // Consumer Attorney Fields
    NAME_CONSUMER_ATTORNEY,
    CONSUMER_ATTORNEY_FIRM,
  } = row;
  const cleanConsumerAttorneyFirm = utils.cleanStr(CONSUMER_ATTORNEY_FIRM);
  const attorneyFirmName = (
    (
      cleanConsumerAttorneyFirm != null &&
      cleanConsumerAttorneyFirm !== '' &&
      cleanConsumerAttorneyFirm.toLowerCase() !== 'attorney at law'
    ) ? cleanConsumerAttorneyFirm
      : `${String(utils.fixName(NAME_CONSUMER_ATTORNEY))}, Attorney at Law`
  );
  const uniqueValue = buildUniqueValue(
    CASE_ID,
    utils.fixName(ARBITRATOR_NAME),
    utils.fixName(NAME_CONSUMER_ATTORNEY),
    attorneyFirmName,
    utils.fixName(NONCONSUMER),
  );
  const caseData = {
    case_id: null,
    import_date: importDate,
    unique_value: uniqueValue,

    case_number: CASE_ID,
    arbitration_board: 'AAA',
    initiating_party: INITIATING_PARTY,
    source_of_authority: SOURCE_OF_AUTHORITY,
    dispute_type: TYPEDISPUTE,
    dispute_subtype: utils.naOr(DISPUTE_SUBTYPE),
    salary_range: SALARY_RANGE,
    prevailing_party: PREVAILING_PARTY,
    type_of_disposition: TYPE_OF_DISPOSITION,

    arb_count: utils.nonNaN(utils.integer(NO_OF_CASES_INVOLVING_BUSINESS)),
    med_count: utils.nonNaN(utils.integer(NO_OF_MEDCASES_NONCONS)),
    arb_or_cca_count: utils.nonNaN(utils.integer(NO_OF_ARBORCCACASES_NONCONS)),

    filing_date: utils.date(FILING_DATE),
    close_date: utils.date(CLOSEDATE),

    claim_amount_business: utils.money(CLAIM_AMT_BUSINESS),
    fee_allocation_business: utils.percent(utils.naOr(FEEALLOCATION_BUSINESS)),
    fees_business: utils.nonNaN(((utils.money(TOTAL_FEE) || 0) * (utils.percent(FEEALLOCATION_BUSINESS) || 0)) / 100),
    award_amount_business: utils.money(AWARD_AMT_BUSINESS),
    attorney_fees_business: utils.money(ATTORNEYFEE_BUSINESS),
    other_relief_business: OTHERRELIEF_BUSINESS,

    claim_amount_consumer: utils.money(CLAIM_AMT_CONSUMER),
    fee_allocation_consumer: utils.percent(utils.naOr(FEEALLOCATION_CONSUMER)),
    fees_consumer: utils.nonNaN(((utils.money(TOTAL_FEE) || 0) * (utils.percent(FEEALLOCATION_CONSUMER) || 0)) / 100),
    award_amount_consumer: utils.money(AWARD_AMT_CONSUMER),
    attorney_fees_consumer: utils.money(ATTORNEYFEE_CONSUMER),
    other_relief_consumer: OTHERRELIEF_CONSUMER,

    consumer_rep_state: CONSUMER_REP_STATE,
    consumer_self_represented: utils.bool(CONSUMER_SELF_REPRESENTED || false),
    document_only_proceeding: utils.bool(DOCUMENT_ONLY_PROCEEDING || false),

    type_of_hearing: TYPE_OF_HEARING,
    hearing_addr1: utils.naOr(HEARING_ADDR1),
    hearing_addr2: utils.naOr(HEARING_ADDR2),
    hearing_city: utils.naOr(HEARING_CITY),
    hearing_state: utils.naOr(HEARING_STATE),
    hearing_zip: utils.naOr(HEARING_ZIP),

    adr_process: ADR_PROCESS,
  };
  validateCaseData(caseData);

  const existingCases = await Case.findAll({ where: { unique_value: uniqueValue } });

  if (existingCases.filter(c => c.import_date.toDateString() === new Date(importDate).toDateString()).length) {
    return false;
  } else if (existingCases.length) {
    caseData.case_id = existingCases[0].case_id;
  }

  const newCase = await Case.create(caseData);

  if (ARBITRATOR_NAME) {
    const arbitrator = await createParty(Party.ARBITRATOR, utils.fixName(ARBITRATOR_NAME));

    await CaseParty.create({
      type: arbitrator.type,
      case_id: newCase.id,
      party_id: arbitrator.id,
      party_name: arbitrator.name,
      party_slug: arbitrator.slug,
      date: utils.date(APPOINTMENT_DATE),
      fees: utils.money(TOTAL_FEE),
    });
  }

  const isSelfRepresented = utils.fixName(NAME_CONSUMER_ATTORNEY) != null;
  const attorney = await createParty(
    Party.ATTORNEY,
    isSelfRepresented ? utils.fixName(NAME_CONSUMER_ATTORNEY) : 'Self Represented'
  );
  const firm = await createParty(
    Party.LAW_FIRM,
    isSelfRepresented ? attorneyFirmName : 'Self Represented',
  );
  await firm.addAttorney(attorney);

  await CaseParty.create({
    type: attorney.type,
    case_id: newCase.id,
    party_id: attorney.id,
    party_name: attorney.name,
    party_slug: attorney.slug,
    firm_id: firm.id,
    firm_slug: firm.slug,
    firm_name: firm.name,
  });

  if (NONCONSUMER) {
    const nonConsumer = await createParty(Party.NON_CONSUMER, utils.fixName(NONCONSUMER));

    await CaseParty.create({
      type: nonConsumer.type,
      case_id: newCase.id,
      party_id: nonConsumer.id,
      party_name: nonConsumer.name,
      party_slug: nonConsumer.slug,
    });
  }

  return true;
}

export default async function importAAA() {
  await runImport(parseRow);
}
