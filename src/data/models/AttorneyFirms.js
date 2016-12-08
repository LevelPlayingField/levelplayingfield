/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('AttorneyFirms', {
  party_id: { type: Sequelize.INTEGER, primaryKey: true },
  firm_id: { type: Sequelize.INTEGER, primaryKey: true },
}, {
  indexes: [
    { fields: ['party_id'] },
    { fields: ['firm_id'] },
  ],
});
