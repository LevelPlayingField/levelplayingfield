import Sequelize from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('attorney_firms', {
  party_id: { type: Sequelize.INTEGER, primaryKey: true },
  firm_id:  { type: Sequelize.INTEGER, primaryKey: true },
}, {
  indexes: [
    { fields: ['party_id'] },
    { fields: ['firm_id'] },
  ]
});
