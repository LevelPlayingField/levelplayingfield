/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('CaseParty', {
  type: Sequelize.STRING(32),
  case_id: { type: Sequelize.UUID, primaryKey: true },
  party_id: { type: Sequelize.INTEGER, primaryKey: true },
  firm_id: Sequelize.INTEGER,
  party_name: Sequelize.STRING(255),
  firm_name: Sequelize.STRING(255),
  party_slug: Sequelize.STRING(255),
  firm_slug: Sequelize.STRING(255),

  date: Sequelize.DATE,
  fees: Sequelize.INTEGER,
}, {
  indexes: [
    { fields: ['case_id'] },
    { fields: ['party_id'] },
    { fields: ['firm_id'] },
  ],
});
