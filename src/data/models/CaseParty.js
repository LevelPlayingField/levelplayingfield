import Sequelize from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('case_party', {
  type: Sequelize.STRING(32),
  case_id: { type: Sequelize.INTEGER, primaryKey: true },
  party_id: { type: Sequelize.INTEGER, primaryKey: true },
  party_name: Sequelize.STRING(255),
  party_type: Sequelize.STRING(32),
  firm_id: Sequelize.INTEGER,

  date: Sequelize.DATE,
  fees: Sequelize.INTEGER,
}, {
  indexes: [
    { fields: ['case_id'] },
    { fields: ['party_id'] },
    { fields: ['firm_id'] },
  ],
});
