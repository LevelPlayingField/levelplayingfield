import pace from 'awesome-progress';
import xlsx from 'xlsx';
import slugify from '../src/core/slugify';
import models, { Case, Party, CaseParty } from '../src/data/models';
import utils from './lib/importlib';

async function createParty(type, name) {
  const slug = slugify(`${type} ${name}`);
  return await Party.findOrCreate({
    where: { slug },
    defaults: { type, name, slug },
  }).spread(p => p);
}

async function parseRow(row) {
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

  const newCase = await Case.create({
    case_number: CASE_ID,
    party: NONCONSUMER,
    initiating_party: INITIATING_PARTY,
    source_of_authority: SOURCE_OF_AUTHORITY,
    dispute_type: TYPEDISPUTE,
    dispute_subtype: DISPUTE_SUBTYPE,
    salary_range: SALARY_RANGE,
    prevailing_party: PREVAILING_PARTY,
    type_of_disposition: TYPE_OF_DISPOSITION,

    arb_count: utils.integer(NO_OF_CASES_INVOLVING_BUSINESS),
    med_count: utils.integer(NO_OF_MEDCASES_NONCONS),
    consumer_arb_count: utils.integer(NO_OF_ARBORCCACASES_NONCONS),

    filing_date: utils.date(FILING_DATE),
    close_date: utils.date(CLOSEDATE),

    fee_allocation_consumer: utils.percent(utils.naOr(FEEALLOCATION_CONSUMER)),
    fee_allocation_business: utils.percent(utils.naOr(FEEALLOCATION_BUSINESS)),

    business_fees: utils.money(CLAIM_AMT_BUSINESS),
    consumer_fees: utils.money(CLAIM_AMT_CONSUMER),
    award_amount_consumer: utils.money(AWARD_AMT_BUSINESS),
    award_amount_business: utils.money(AWARD_AMT_CONSUMER),
    attorney_fees_consumer: utils.money(ATTORNEYFEE_BUSINESS),
    attorney_fees_business: utils.money(ATTORNEYFEE_CONSUMER),

    other_relief_consumer: OTHERRELIEF_BUSINESS,
    other_relief_business: OTHERRELIEF_CONSUMER,
    consumer_rep_state: CONSUMER_REP_STATE,
    consumer_self_represented: utils.bool(CONSUMER_SELF_REPRESENTED || false),
    document_only_proceeding: utils.bool(DOCUMENT_ONLY_PROCEEDING || false),
    type_of_hearing: TYPE_OF_HEARING,
    hearing_addr1: HEARING_ADDR1,
    hearing_addr2: HEARING_ADDR2,
    hearing_city: HEARING_CITY,
    hearing_state: HEARING_STATE,
    hearing_zip: HEARING_ZIP,

    adr_process: ADR_PROCESS,
  });

  if (ARBITRATOR_NAME) {
    const arbitrator = await createParty(Party.ARBITRATOR, utils.cleanStr(ARBITRATOR_NAME));

    await CaseParty.create({
      party_id: arbitrator.id,
      case_id: newCase.id,
      party_name: arbitrator.name,
      party_type: arbitrator.type,
      date: utils.date(APPOINTMENT_DATE),
      fees: utils.money(TOTAL_FEE),
    });
  }

  if (NAME_CONSUMER_ATTORNEY) {
    const attorney = await createParty(Party.ATTORNEY, utils.cleanStr(NAME_CONSUMER_ATTORNEY));
    const firm = await createParty(
      Party.LAW_FIRM,
      (
        utils.cleanStr(CONSUMER_ATTORNEY_FIRM) !== '' &&
        utils.cleanStr(CONSUMER_ATTORNEY_FIRM).toLowerCase() !== 'attorney at law'
      ) ? utils.cleanStr(CONSUMER_ATTORNEY_FIRM)
        : `${attorney.name}, Attorney at Law`
    );
    await firm.addAttorney(attorney);

    await CaseParty.create({
      party_id: attorney.id,
      firm_id: firm.id,
      case_id: newCase.id,
      party_name: attorney.name,
      party_type: attorney.type,
    });
  }

  if (NONCONSUMER) {
    const nonConsumer = await createParty(Party.NON_CONSUMER, utils.cleanStr(NONCONSUMER));

    await CaseParty.create({
      party_name: nonConsumer.name,
      party_type: nonConsumer.type,
      party_id: nonConsumer.id,
      case_id: newCase.id,
    });
  }
}

async function runImport() {
  const workbook = xlsx.readFile(process.argv[process.argv.length - 1]);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_row_object_array(worksheet);
  const pb = pace(rows.length);

  await models.sync({ logging: false });

  for (const row of rows) {
    try {
      await parseRow(row);
      pb.op();
    } catch (e) {
      console.error(e);
      console.log('Failed on row', row);
      pb.op({ errors: 1 });
    }
  }
}

export default runImport;
