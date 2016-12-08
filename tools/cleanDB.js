import models from '../src/data/models';
import sequelize from '../src/data/sequelize';

async function runCleanDB() {
  await models.sync();

  await sequelize.query(`
    TRUNCATE TABLE "case_parties", "attorney_firms", "parties", "cases";
    ALTER SEQUENCE cases_case_id_seq RESTART;
    ALTER SEQUENCE parties_id_seq RESTART;
    REFRESH MATERIALIZED VIEW search_view;
`);
  await sequelize.close();
}

export default runCleanDB;
