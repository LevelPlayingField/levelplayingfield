/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Summary = sequelize.define('summary_data', {
  name: { type: Sequelize.STRING(32), primaryKey: true },
  data: { type: Sequelize.JSONB() },
}, {
  createdAt: false,
  updatedAt: false,
  view: true,
});
Summary.sync = function sync() {
  // language=PostgreSQL
  return sequelize.query(`--
DROP MATERIALIZED VIEW IF EXISTS summary_data;
CREATE MATERIALIZED VIEW summary_data ("name", "data") AS (
  WITH case_ids AS (
    SELECT DISTINCT ON (case_id) id
    FROM "case"
    ORDER BY case_id ASC, import_date DESC
  )
  SELECT
    'null' :: CHARACTER VARYING,
    '{}' :: JSON
  UNION ALL
  SELECT
    'case_dispositions',
    json_object_agg(year, data)
  FROM (
         SELECT
           year,
           json_object_agg(disposition, count) AS data
         FROM (SELECT
                 EXTRACT(YEAR FROM close_date) AS year,
                 type_of_disposition           AS disposition,
                 count("case".id)              AS count
               FROM case_ids, "case"
               WHERE case_ids.id = "case".id
               GROUP BY 1, 2) case_dispositions
         GROUP BY year
       ) yearly_dispositions
  UNION ALL
  SELECT
    'case_awards',
    json_object_agg(year, data)
  FROM (
         SELECT
           year,
           json_object_agg(award, count) AS data
         FROM (SELECT
                 EXTRACT(YEAR FROM close_date) AS year,
                 CASE WHEN prevailing_party = '---'
                   THEN 'Unknown'
                 ELSE prevailing_party END     AS award,
                 count("case".id)              AS count
               FROM case_ids, "case"
               WHERE case_ids.id = "case".id
                     AND "case".type_of_disposition = 'Awarded'
               GROUP BY 1, 2) case_prevailing_parties
         GROUP BY 1
       ) case_awards
)
WITH DATA;
`);
};

export default Summary;
