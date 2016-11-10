const nonNaN = v => (isNaN(v) ? null : v);
const nullOr = c => v => ((v === null || String(v).trim() === '') ? null : c(v));
const date = v => new Date(v);
const integer = v => parseInt(v, 10);
const decimal = v => parseFloat(v);
const rtrim = c => v => v.replace(new RegExp(`${c}+$`), '');
const ltrim = c => v => v.replace(new RegExp(`^${c}+`), '');
const cleanStr = str => String(str).replace(/\s+/, ' ').trim();
const lookupValue = table => str => table[str];
const naOr = str => (['na', 'n/a', 'nan', 'none', 'null', 'undefined'].indexOf(str.toString().toLowerCase()) === -1 ? null : str);
const percent = v => ((typeof v === 'string') ? decimal(rtrim('%')(v)) : decimal(v));
const bool = v => ['true', 't', 'yes', 'y'].indexOf(v.toString().toLowerCase()) !== -1;
const money = v => {
  let dec;

  if (typeof v === 'string') {
    dec = decimal(ltrim('\\$')(v));
  } else {
    dec = decimal(v);
  }

  return Math.floor(dec * 100);
};

export default {
  date: nullOr(date),
  integer: nullOr(integer),
  decimal: nullOr(nonNaN(decimal)),
  rtrim: nullOr(rtrim),
  ltrim: nullOr(ltrim),
  cleanStr: nullOr(cleanStr),
  lookupValue: nullOr(lookupValue),
  naOr: nullOr(naOr),
  percent: nullOr(percent),
  money: nullOr(money),
  bool: nullOr(bool),
};
