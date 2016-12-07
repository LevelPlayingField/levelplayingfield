import { Case, Party, CaseParty } from '../src/data/models';
import utils, { buildUniqueValue, createParty, runImport, validateCaseData } from './lib/importlib';

async function parseRow(row, deleteOldCase = false) {
  let retValue = true;
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
  const attorneyFirmName = (
    (
      CONSUMER_ATTORNEY_FIRM != null &&
      utils.cleanStr(CONSUMER_ATTORNEY_FIRM) !== '' &&
      utils.cleanStr(CONSUMER_ATTORNEY_FIRM).toLowerCase() !== 'attorney at law'
    ) ? utils.cleanStr(CONSUMER_ATTORNEY_FIRM)
      : `${utils.cleanStr(NAME_CONSUMER_ATTORNEY)}, Attorney at Law`
  );
  const uniqueValue = buildUniqueValue(
    CASE_ID,
    utils.cleanStr(ARBITRATOR_NAME),
    utils.cleanStr(NAME_CONSUMER_ATTORNEY),
    attorneyFirmName,
    utils.cleanStr(NONCONSUMER),
  );
  const caseData = {
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
    fees_business: utils.nonNaN((utils.money(TOTAL_FEE) * utils.percent(FEEALLOCATION_BUSINESS)) / 100),
    award_amount_business: utils.money(AWARD_AMT_BUSINESS),
    attorney_fees_business: utils.money(ATTORNEYFEE_BUSINESS),
    other_relief_business: OTHERRELIEF_BUSINESS,

    claim_amount_consumer: utils.money(CLAIM_AMT_CONSUMER),
    fee_allocation_consumer: utils.percent(utils.naOr(FEEALLOCATION_CONSUMER)),
    fees_consumer: utils.nonNaN((utils.money(TOTAL_FEE) * utils.percent(FEEALLOCATION_CONSUMER)) / 100),
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

  if (deleteOldCase) {
    retValue = !(await Case.destroy({ where: { unique_value: uniqueValue } }));
  } else {
    const caseExists = await Case.count({ where: { unique_value: uniqueValue } });

    if (caseExists) {
      return false;
    }
  }

  const newCase = await Case.create(caseData);

  if (ARBITRATOR_NAME) {
    const arbitrator = await createParty(Party.ARBITRATOR, utils.cleanStr(ARBITRATOR_NAME));

    await CaseParty.create({
      party_id: arbitrator.id,
      case_id: newCase.id,
      party_name: arbitrator.name,
      party_slug: arbitrator.slug,
      type: arbitrator.type,
      date: utils.date(APPOINTMENT_DATE),
      fees: utils.money(TOTAL_FEE),
    });
  }

  const isSelfRepresented = utils.cleanStr(NAME_CONSUMER_ATTORNEY) != null;
  const attorney = await createParty(
    Party.ATTORNEY,
    isSelfRepresented ? utils.cleanStr(NAME_CONSUMER_ATTORNEY) : 'Self Represented'
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
    firm_id: firm.id,
    firm_slug: firm.slug,
    firm_name: firm.name,
  });

  if (NONCONSUMER) {
    const nonConsumer = await createParty(Party.NON_CONSUMER, utils.cleanStr(NONCONSUMER));

    await CaseParty.create({
      party_name: nonConsumer.name,
      type: nonConsumer.type,
      party_id: nonConsumer.id,
      party_slug: nonConsumer.slug,
      case_id: newCase.id,
    });
  }

  return retValue;
}

export default async function importAAA() {
  await runImport(parseRow);
}
