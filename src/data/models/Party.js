/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Party = sequelize.define('Party', {
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
  await sequelize.query(/* language=PostgreSQL */ `--
WITH case_ids AS (
  SELECT DISTINCT ON (case_id) id
  FROM cases
  ORDER BY case_id ASC, import_date DESC
), party_ids AS (
  SELECT id AS party_id
  FROM parties
), case_dispositions_data AS (
  SELECT
    p.party_id                      AS party_id,
    EXTRACT(YEAR FROM c.close_date) AS quarter,
    c.type_of_disposition           AS disposition,
    COUNT(c.id)                     AS count
  FROM party_ids p
    LEFT JOIN case_parties cp ON cp.party_id = p.party_id OR cp.firm_id = p.party_id
    JOIN case_ids ON cp.case_id = case_ids.id
    JOIN cases c ON case_ids.id = c.id
  GROUP BY 1, 2, 3
), case_dispositions AS (
  SELECT
    d.party_id                              AS party_id,
    d.quarter                               AS quarter,
    json_object_agg(d.disposition, d.count) AS data
  FROM case_dispositions_data d
  GROUP BY 1, 2
), case_awards_data AS (
  SELECT
    party_ids.party_id            AS party_id,
    EXTRACT(YEAR FROM close_date) AS quarter,
    CASE WHEN prevailing_party = '---'
      THEN 'Unknown'
    ELSE prevailing_party END     AS awarded_party,
    COUNT(*)                      AS count
  FROM party_ids
    LEFT JOIN case_parties
      ON case_parties.party_id = party_ids.party_id OR case_parties.firm_id = party_ids.party_id
    JOIN case_ids ON case_parties.case_id = case_ids.id
    JOIN cases c ON case_ids.id = c.id
  WHERE c.type_of_disposition = 'Awarded'
  GROUP BY 1, 2, 3
), case_awards AS (
  SELECT
    d.party_id                                AS party_id,
    d.quarter                                 AS quarter,
    json_object_agg(d.awarded_party, d.count) AS data
  FROM case_awards_data d
  GROUP BY 1, 2
), case_types_data AS (
  SELECT
    party_ids.party_id                       AS party_id,
    EXTRACT(YEAR FROM close_date)            AS quarter,
    aaa_normalize_dispute_type(dispute_type) AS normal_type,
    count(*)                                 AS count
  FROM party_ids
    LEFT JOIN case_parties
      ON case_parties.party_id = party_ids.party_id OR case_parties.firm_id = party_ids.party_id
    join case_ids on case_parties.case_id = case_ids.id
    JOIN cases c on case_ids.id = c.id
  GROUP BY 1, 2, 3
), case_types AS (
  SELECT
    d.party_id                              AS party_id,
    d.quarter                               AS quarter,
    json_object_agg(d.normal_type, d.count) AS data
  FROM case_types_data d
  GROUP BY 1, 2
), aggregate_data AS (
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
  UNION ALL

  SELECT
    party_id                           AS party_id,
    'types' :: CHARACTER VARYING       AS key,
    json_object_agg(quarter, data) AS data
  FROM case_types
  GROUP BY party_id
), data AS (
  SELECT
    party_id                                                 AS party_id,
    json_object_agg(aggregate_data.key, aggregate_data.data) AS data
  FROM aggregate_data
  GROUP BY party_id
)
UPDATE parties
SET aggregate_data = data.data
FROM data
WHERE parties.id = data.party_id;`);
};

export default Party;
