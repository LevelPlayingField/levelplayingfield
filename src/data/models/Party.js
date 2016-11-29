/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Party = sequelize.define('party', {
  type: Sequelize.STRING(32),
  name: Sequelize.STRING(255),
  slug: Sequelize.STRING(255),
  aggregate_data: Sequelize.JSONB(),
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

Party.updateAggregateData = async function updateAggregateData() {
  await sequelize.query(/* language=PostgreSQL */ `WITH
    case_dispositions_data AS (
    SELECT
      case_party.party_id,
      EXTRACT(YEAR FROM close_date) AS quarter,
      type_of_disposition           AS disposition,
      COUNT(*)                      AS count
    FROM "case"
      LEFT JOIN case_party ON "case".id = case_party.case_id
    GROUP BY 1, 2, 3
  ),
    case_dispositions AS (
    SELECT
      d.party_id                              AS party_id,
      d.quarter                               AS quarter,
      json_object_agg(d.disposition, d.count) AS data
    FROM case_dispositions_data d
    GROUP BY 1, 2
  ),
    case_awards_data AS (
    SELECT
      case_party.party_id,
      EXTRACT(YEAR FROM close_date) AS quarter,
      CASE WHEN prevailing_party = '---'
        THEN 'Unknown'
      ELSE prevailing_party END     AS awarded_party,
      COUNT(*)                      AS count
    FROM "case"
      LEFT JOIN case_party ON "case".id = case_party.case_id
    WHERE "case".type_of_disposition = 'Awarded'
    GROUP BY 1, 2, 3
  ),
    case_awards AS (
    SELECT
      d.party_id                                AS party_id,
      d.quarter                                 AS quarter,
      json_object_agg(d.awarded_party, d.count) AS data
    FROM case_awards_data d
    GROUP BY 1, 2
  ),
    aggregate_data AS (
    SELECT
      case_dispositions.party_id,
      jsonb_build_object(
        'dispositions', json_object_agg(case_dispositions.quarter, case_dispositions.data),
        'awards', json_object_agg(case_dispositions.quarter, case_awards.data)
      ) AS DATA
    FROM case_dispositions, case_awards
    WHERE case_dispositions.party_id = case_awards.party_id
    GROUP BY case_dispositions.party_id
  )
UPDATE party
SET aggregate_data = aggregate_data.data
FROM aggregate_data
WHERE party.id = aggregate_data.party_id;

SELECT name, aggregate_data
FROM party
WHERE slug ILIKE 'non-consumer-citi%'`);
};

export default Party;
