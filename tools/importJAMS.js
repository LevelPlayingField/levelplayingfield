/* eslint-disable dot-notation, max-len, no-unused-vars, prefer-const */

import { Party, Case, CaseParty } from '../src/data/models';
import utils, { runImport, createParty, validateCaseData } from './lib/importlib';

const awardTypes = {
  MONETARY_AWARD: 'Monetary Award',
  ATTORNEY_FEES: 'Attorney Fees',
  NON_MONETARY_AWARD: 'Non-Monetary Award',
};

const moneyRegex = /^\$?[\d,.]+$/;
const awardsRegex = /(Monetary Award|Attorney Fees|Non-Monetary Award): .*?)(?=(Monetary Award|Attorney Fees|Non-Monetary Award|$))/g;

function parseAwards(awards) {
  if (typeof awards === 'number' || moneyRegex.test(awards)) {
    return { 'Monetary Award': utils.money(awards) };
  }

  const awardValues = {};
  let match = awardsRegex.exec(awards);

  while (match !== null) {
    const [all, type, value] = match;

    if (all) {
      awardValues[type] = moneyRegex.test(utils.cleanStr(value)) ? utils.money(value) : value;
    }

    match = awardsRegex.exec(awards);
  }

  return awardValues;
}

function parseAttorneyNames(names) {
  if (names === undefined || names === null) {
    return [];
  }
  const seen = new Set();

  return names.split(';').map(utils.cleanStr).map(name => {
    if (!name) {
      return null;
    }

    const [attorney, fullFirm] = utils.cleanStr(name).split(':').map(utils.cleanStr);
    let [firm, fullLocation] = utils.rsplit(fullFirm, '-').map(utils.cleanStr);
    let city;
    let state;

    if (fullLocation) {
      [city, state] = fullLocation.split(',').map(utils.cleanStr);
    }

    if (!utils.cleanStr(firm) || firm.indexOf('L/O') !== -1) {
      firm = `${attorney}, Attorney at Law`;
    }

    return { attorney, firm, city, state };
  }).filter(p => p !== null)
    .filter(p => {
      if (seen.has(p.name)) {
        return false;
      }
      seen.add(p.name);
      return true;
    });
}

function lookupStateForCity(city) {
  switch (city) {
    case 'Mesa/ Phoenix':
      return 'AZ';
    case 'Camarillo':
    case 'Westlake Village':
      return 'CA';
    case 'Denver':
      return 'CO';
    case 'Hartford':
      return 'CT';
    case 'Tampa':
    case 'Deland':
    case 'Talladega':
      return 'FL';
    case 'Marlborough':
      return 'MA';
    case 'Grand Rapids':
      return 'MI';
    case 'Atlantic City':
      return 'NJ';
    case 'Albuquerque':
      return 'NM';
    case 'Oklahoma City':
      return 'OK';
    case 'Seaside':
      return 'OR';
    case 'Memphis':
      return 'TN';
    case 'Brownsville':
    case 'Lubbock':
    case 'McAllen':
    case 'Woodlands':
      return 'TX';
    case 'Hampton':
    case 'Fairfax':
      return 'VA';
    default:
      return null;
  }
}

function lookupAllocation(allocation) {
  switch (allocation) {
    case 'CONSUMER - 100':
    case '$50 from Claimant- rest paid by Halliburton':
      return { CONSUMER: 100, NON_CONSUMER: 0 };

    case '100% Non-Consumer Party except for $25 CMF to Consumer Party':
    case 'NONCONSUMER-100':
      return { CONSUMER: 0, NON_CONSUMER: 100 };

    case 'NONCONSUMER - 50 CONSUMER 50':
      return { CONSUMER: 50, NON_CONSUMER: 50 };

    case '$50/$1150 for Claimant and Respondent on filing fees, and th':
    case 'Case Abandoned':
    case 'Matter settled between the Parties prior to Hearing':
    case 'Employee will pay for the first $355 of arbitration fees, an':
    case 'No filing fees received.':
    case 'Award for Respondent; no atty fee granted':
    case 'Global Settlement':
    default:
      return { CONSUMER: 0, NON_CONSUMER: 0 };
  }
}

async function parseRow(row) {
  const REFNO = row['REFNO'];
  const ARB_PRE_DISPUTE_CLAUSE = row['Arb Demanded – Pre Dispute Clause'];
  const ARB_CLAUSE_DESIGNATED_PROVIDER = row['Arb Clause Designated Provider'];
  const NONCONSUMER_PARTY = row['NONCONSUMER PARTY'];
  const ARB_COUNT = row['ARB COUNT'];
  const MED_COUNT = row['MED COUNT'];
  const CONSUMER_ARB_COUNT = row['CONSUMER ARB COUNT'];
  const INITIATED_BY = row['INITIATED BY'];
  const TYPE_OF_DISPUTE = row['TYPE OF DISPUTE'];
  const SALARY_RANGE = row['Salary Range (if Employment)'];
  const PREVAILING_PARTY = row['PREVAILING PARTY'];
  const CONSUMER_PARTY_REP_BY_ATTY = row['Consumer Party Rep by Atty'];
  const CONSUMER_PARTY_ATTORNEY_NAMES = row['Consumer Party Attorney Names, if applicable'];
  const DATE_DEMAND_RECEIVED = row['DATE DEMAND RECEIVED'];
  const DATE_CASE_RESULT = row['DATE CASE RESULT'];
  const RESULT = row['RESULT\r\n(See footnote 1 for "Dismissal\r\n Without Hearing")'];
  const HEARING = row['HEARING'];
  const HEARING_TYPE = row['Hearing Type (if held)'];
  const HEARING_LOCATION = row['HEARING LOCATION'];
  const CLAIM_AMOUNT = row['CLAIM AMOUNT'];
  const EQUITABLE_RELIEF_DEMANDED = row['Equitable Relief Demanded'];
  const AWARD = row['AWARD'];
  const FEE_ALLOCATION = row['FEE ALLOCATION\r\n(See footnote 2)'];
  const FEE_WAIVER_GRANTED = row['FEE WAIVER GRANTED'];

  if (!REFNO) {
    return;
  } else if (ARB_PRE_DISPUTE_CLAUSE === 'pre-2015') {
    // throw new Error('Cannot handle pre-2015 JAMS cases');
    return;
  }

  const attorneys = parseAttorneyNames(utils.naOr(CONSUMER_PARTY_ATTORNEY_NAMES));
  const awards = parseAwards(utils.naOr(AWARD));
  const allocation = lookupAllocation(utils.naOr(FEE_ALLOCATION));
  const arbitrators = [1, 2, 3].map((arbitratorId) => {
    const name = utils.cleanStr(utils.naOr(row[`ARBITRATOR_NAME_${arbitratorId}`]));
    if (!name) {
      return null;
    }

    const fees = utils.money(utils.naOr(row[`ARBITRATOR_FEES_${arbitratorId}`]));
    const date = utils.date(utils.naOr(row[`ARBITRATOR_APPOINTED_${arbitratorId}`]));

    return { name, fees, date };
  }).filter(arbitrator => arbitrator !== null);
  const totalArbitratorFees = arbitrators.reduce((total, { fees }) => (total + fees), 0);

  const caseData = {
    case_number: utils.cleanStr(REFNO),
    arbitration_board: 'JAMS',
    initiating_party: utils.naOr(INITIATED_BY),
    source_of_authority: utils.naOr(ARB_CLAUSE_DESIGNATED_PROVIDER),
    dispute_type: utils.naOr(TYPE_OF_DISPUTE),
    dispute_subtype: null,
    salary_range: utils.naOr(SALARY_RANGE),
    prevailing_party: utils.naOr(PREVAILING_PARTY),
    filing_date: utils.date(utils.naOr(DATE_DEMAND_RECEIVED)),
    close_date: utils.date(utils.naOr(DATE_CASE_RESULT)),
    type_of_disposition: RESULT,
    consumer_rep_state: attorneys.length && utils.naOr(attorneys[0].state),
    consumer_self_represented: !utils.bool(CONSUMER_PARTY_REP_BY_ATTY),

    claim_amount_business: utils.nonNaN(utils.money(utils.naOr(CLAIM_AMOUNT))),
    fee_allocation_business: allocation.NON_CONSUMER,
    fees_business: utils.money(utils.nonNaN(totalArbitratorFees * allocation.NON_CONSUMER)),
    award_amount_business: utils.nonNaN((allocation.NON_CONSUMER / 100) * awards[awardTypes.MONETARY_AWARD]),
    attorney_fees_business: utils.nonNaN((allocation.NON_CONSUMER / 100) * awards[awardTypes.ATTORNEY_FEES]),
    other_relief_business: utils.nonNaN((allocation.NON_CONSUMER > 0) ? awards[awardTypes.NON_MONETARY_AWARD] : null),

    claim_amount_consumer: utils.nonNaN(utils.money(utils.naOr(CLAIM_AMOUNT))),
    fee_allocation_consumer: allocation.CONSUMER,
    fees_consumer: utils.money(utils.nonNaN(totalArbitratorFees * allocation.NON_CONSUMER)),
    award_amount_consumer: utils.nonNaN((allocation.CONSUMER / 100) * awards[awardTypes.MONETARY_AWARD]),
    attorney_fees_consumer: utils.nonNaN((allocation.CONSUMER / 100) * awards[awardTypes.ATTORNEY_FEES]),
    other_relief_consumer: utils.nonNaN((allocation.CONSUMER > 0) ? awards[awardTypes.NON_MONETARY_AWARD] : null),

    document_only_proceeding: null,

    type_of_hearing: utils.naOr(HEARING_TYPE),
    hearing_city: utils.naOr(HEARING_LOCATION),
    hearing_state: lookupStateForCity(HEARING_LOCATION),

    arb_count: utils.integer(ARB_COUNT) || 0,
    med_count: utils.integer(MED_COUNT) || 0,
    arb_or_cca_count: utils.integer(CONSUMER_ARB_COUNT) || 0,
  };
  validateCaseData(caseData);
  const newCase = await Case.create(caseData);

  if (NONCONSUMER_PARTY) {
    const party = await createParty(Party.NON_CONSUMER, utils.cleanStr(NONCONSUMER_PARTY));

    await CaseParty.create({
      party_id: party.id,
      case_id: newCase.id,
      party_name: party.name,
      party_type: party.type,
    });
  }

  await Promise.all(arbitrators.map(async({ name, fees, date }) => {
    const party = await createParty(Party.ARBITRATOR, name);

    await CaseParty.create({
      party_id: party.id,
      case_id: newCase.id,
      party_name: party.name,
      party_type: party.type,
      date: date === 'Invalid Date' ? null : date,
      fees,
    });
  }));

  await Promise.all(attorneys.map(async({ attorney, firm }) => {
    const attorneyParty = await createParty(Party.ATTORNEY, attorney);
    const firmParty = await createParty(Party.LAW_FIRM, firm);

    await firmParty.addAttorney(attorneyParty);
    await CaseParty.create({
      case_id: newCase.id,
      firm_id: firmParty.id,
      party_id: attorneyParty.id,
      party_type: attorneyParty.type,
      party_name: attorneyParty.name,
    });
  }));
}

export default async function importJAMS() {
  await runImport(parseRow);
}
