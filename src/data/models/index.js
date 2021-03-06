/* @flow */

import sequelize from '../sequelize';
import AttorneyFirms from './AttorneyFirms';
import CaseParty from './CaseParty';
import Case from './Case';
import Party from './Party';
import Search from './Search';
import Summary from './Summary';

Case.Parties = Case.hasMany(CaseParty, {
  foreignKey: 'case_id',
  as: 'Parties',
});

Party.Cases = Party.hasMany(CaseParty, {
  foreignKey: 'party_id',
  as: 'Cases',
});
Party.FirmCases = Party.hasMany(CaseParty, {
  foreignKey: 'firm_id',
  as: 'FirmCases',
});
Party.Firms = Party.belongsToMany(Party, {
  as: 'Firms',
  through: 'attorney_firms',
  foreignKey: 'party_id',
});
Party.Attorneys = Party.belongsToMany(Party, {
  as: 'Attorneys',
  through: 'attorney_firms',
  foreignKey: 'firm_id',
});

CaseParty.Case = CaseParty.belongsTo(Case, {
  foreignKey: 'case_id',
  as: 'Case',
});
CaseParty.Party = CaseParty.belongsTo(Party, {
  foreignKey: 'party_id',
  as: 'Party',
});
CaseParty.Firm = CaseParty.belongsTo(Party, {
  foreignKey: 'firm_id',
  as: 'Firm',
});

async function sync(options: any): Promise<*> {
  return sequelize.sync(options);
}

export default { sync };
export {
  AttorneyFirms,
  Case,
  CaseParty,
  Party,
  Search,
  Summary,
};
