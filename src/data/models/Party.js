/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Party = sequelize.define('party', {
  type: Sequelize.STRING(32),
  name: Sequelize.STRING(255),
  slug: Sequelize.STRING(255),
}, {
  indexes: [
    { fields: ['id'] },
    { fields: ['name'] },
    { fields: ['type', 'name'] },
  ],
});

Party.NON_CONSUMER = 'Non Consumer';
Party.ARBITRATOR = 'Arbitrator';
Party.ATTORNEY = 'Attorney';
Party.LAW_FIRM = 'Law Firm';

export default Party;
