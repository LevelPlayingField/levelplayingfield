import Sequelize from 'sequelize';
import sequelize from '../sequelize';

export default sequelize.define('party', {
  type: Sequelize.STRING(32),
  name: Sequelize.STRING(255),
  slug: Sequelize.STRING(255),
}, {
  indexes: [
    { fields: ['id'] },
    { fields: ['name'] },
    { fields: ['type', 'name'] },
  ]
});
