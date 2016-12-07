/* @flow */

import pace from 'awesome-progress';
import xlsx from 'xlsx';
import slugify from '../../src/core/slugify';
import models, { Party, Search, Summary } from '../../src/data/models';

const NA = new Set(['na', 'n/a', 'nan', 'unknown', 'none', 'null', 'undefined']);

const nonNaN = (v: any) => (isNaN(v) ? null : v);
const nullOr = (c: (v: any) => any) => (v: any) => ((v == null || String(v).trim() === '') ? null : c(v));
const date = (v: any) => new Date(v);
const integer = (v: any) => parseInt(v, 10);
const decimal = (v: any) => parseFloat(v);
const rtrim = c => v => v.replace(new RegExp(`${c}+$`), '');
const ltrim = c => v => v.replace(new RegExp(`^${c}+`), '');
const rsplit = (v: ?string, c: string) => {
  if (v == null) {
    return null;
  }
  const parts = v.split(c);
  const right = parts.pop();
  return [parts.join(c), right];
};
const cleanStr = str => String(str).replace(/\s+/, ' ').trim();
const lookupValue = (table: {[key: string]: string}) => (str: string) => table[str];
const naOr = (str: string, v: ?string = null) => (NA.has(String(str).toLowerCase()) ? v : str);
const percent = v => ((typeof v === 'string') ? decimal(rtrim('%')(v)) : decimal(v));
const bool = v => ['true', 't', 'yes', 'y'].indexOf(v.toString().toLowerCase()) !== -1;
const money = v => {
  let dec;

  if (typeof v === 'string') {
    dec = decimal(ltrim('\\$')(v).replace(',', ''));
  } else {
    dec = decimal(v);
  }

  return Math.floor(dec * 100);
};
const fixName = (name: string): string => {
  switch (cleanStr(name)) {
    case 'AT&T*':
      return 'AT&T';
    default:
      return cleanStr(name);
  }
}

function isInvalidData(v) {
  return (
    ['na', 'n/a', 'nan', 'none', 'unknown'].indexOf(String(v).toLowerCase()) !== -1 ||
    (typeof v === 'number' && isNaN(v))
  );
}

function validateCaseData(caseData: {[key:string]: any}) {
  const errors = [];

  for (const k of Object.keys(caseData)) {
    if (isInvalidData(caseData[k])) {
      errors.push(`caseData["${k}"] -> "${caseData[k]}" is invalid`);
    }
  }

  if (errors.length) {
    throw new Error(`Validation Error on caseData\n${errors.join('\n')}`);
  }
}

async function createParty(type: string, name: any) {
  const slug = slugify(`${type} ${name}`);
  return await Party.findOrCreate({
    where: { slug },
    defaults: { type, name, slug },
  }).spread(p => p);
}

function buildUniqueValue(caseNumber: string, ...partyNames: Array<?string>) {
  return [caseNumber, ...partyNames.filter(v => v != null).map(nullOr(slugify))].join(',');
}

async function runImport(parseRow: (row: {[key:string]: any}) => bool) {
  const workbook = xlsx.readFile(process.argv[process.argv.length - 1]);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const deleteOldCases = process.argv.includes('--deleteOldCases');
  const rows = xlsx.utils.sheet_to_row_object_array(worksheet);
  const pb = pace(rows.length);

  await models.sync({ logging: false });

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    try {
      if (await parseRow(row, deleteOldCases)) {
        created += 1;
      } else {
        skipped += 1;
      }

      pb.op();
    } catch (e) {
      console.log('\n\n\n\n');
      console.error(e);
      console.log('Failed on row', row);
      pb.op({ errors: 1 });
    }
  }

  console.log('Added', created);
  console.log(deleteOldCases ? 'Deleted' : 'Skipped', skipped);

  await Party.updateAggregateData();
  await Search.refreshView();
  await Summary.sync();
}

export default {
  date: nullOr(date),
  integer: nullOr(integer),
  decimal: nullOr((v) => nonNaN(decimal(v))),
  rtrim: nullOr(rtrim),
  ltrim: nullOr(ltrim),
  cleanStr: nullOr(cleanStr),
  lookupValue: nullOr(lookupValue),
  percent: nullOr(percent),
  money: nullOr(money),
  bool: nullOr(bool),
  fixName: nullOr(fixName),
  nonNaN,
  naOr,
  rsplit,
};
export {
  runImport,
  buildUniqueValue,
  createParty,
  validateCaseData,
};
