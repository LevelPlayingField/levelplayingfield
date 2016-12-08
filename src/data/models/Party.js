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
  await sequelize.query(/* language=PostgreSQL */ `WITH case_ids AS (
  SELECT DISTINCT ON (case_id)
    id
  FROM "case"
  ORDER BY case_id ASC, import_date DESC
),
    parties AS (
    SELECT id AS party_id
    FROM party
  ),
    case_dispositions_data AS (
    SELECT
      p.party_id                      AS party_id,
      EXTRACT(YEAR FROM c.close_date) AS quarter,
      c.type_of_disposition           AS disposition,
      COUNT(c.id)                     AS count
    FROM parties p
      LEFT JOIN case_party cp ON cp.party_id = p.party_id OR cp.firm_id = p.party_id
      JOIN case_ids ON cp.case_id = case_ids.id
      JOIN "case" c ON case_ids.id = c.id
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
      parties.party_id              AS party_id,
      EXTRACT(YEAR FROM close_date) AS quarter,
      CASE WHEN prevailing_party = '---'
        THEN 'Unknown'
      ELSE prevailing_party END     AS awarded_party,
      COUNT(*)                      AS count
    FROM parties
      LEFT JOIN case_party
        ON case_party.party_id = parties.party_id OR case_party.firm_id = parties.party_id
      JOIN case_ids ON case_party.case_id = case_ids.id
      JOIN "case" c ON case_ids.id = c.id
    WHERE c.type_of_disposition = 'Awarded'
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
      party_id                       AS party_id,
      'awards' :: CHARACTER VARYING  AS key,
      json_object_agg(quarter, data) AS data
    FROM case_awards
    GROUP BY party_id
    UNION ALL

    SELECT
      party_id                            AS party_id,
      'dispositions' :: CHARACTER VARYING AS key,
      json_object_agg(quarter, data)      AS data
    FROM case_dispositions
    GROUP BY party_id
  ),
    data AS (
    SELECT
      party_id                                                 AS party_id,
      json_object_agg(aggregate_data.key, aggregate_data.data) AS data
    FROM aggregate_data
    GROUP BY party_id
  )
UPDATE party
SET aggregate_data = data.data
FROM data
WHERE party.id = data.party_id;`);
};

export default Party;
