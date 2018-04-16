/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Search = sequelize.define('SearchView', {
  type: { type: Sequelize.STRING(32), primaryKey: true },
  id: { type: Sequelize.INTEGER, primaryKey: true },
  slug: Sequelize.STRING(255),
  document: Sequelize.JSON,
  vector: Sequelize.STRING,
  index: Sequelize.STRING,
}, {
  tableName: 'search_view',
  createdAt: false,
  updatedAt: false,
  view: true,
});
Search.refreshView = function refreshView() {
  // language=PostgreSQL
  return sequelize.query('REFRESH MATERIALIZED VIEW search_view;');
};
Search.sync = function sync() {
  return sequelize.query(/* language=PostgreSQL */ `--
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE OR REPLACE FUNCTION english_join(CHARACTER VARYING [])
  RETURNS CHARACTER VARYING AS
$BODY$
DECLARE
  length INTEGER;
BEGIN
  length := array_length($1, 1);
  IF length = 1
  THEN
    RETURN ($1) [1];
  ELSIF length = 2
    THEN
      RETURN array_to_string($1, ' and ', 'Unknown');
  ELSE
    RETURN array_to_string(($1) [1 :length - 1], ', ', 'Unknown') || ', and ' || ($1) [length];
  END IF;
END $BODY$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION aaa_normalize_dispute_type(dispute_type TEXT)
  RETURNS TEXT AS $$
SELECT CASE
       WHEN dispute_type IN (
         'Consumer',
         'Consumer Construction',
         'Consumer Real Esate',
         'Consumer Real Estate',
         'Residential Real Estate',
         'Residential Construction (B2C)',
         'Texas Nonsubscriber'
       )
         THEN 'Consumer'
       -- 'Employer Promulgated Employment'
       -- 'Employment Issues/Commercial Contract'
       -- 'Other Industry'
       ELSE 'Employment'
       END;
$$
LANGUAGE SQL;


CREATE OR REPLACE VIEW case_search_view AS
  WITH parties AS (
    SELECT
      case_parties.case_id                                AS id,
      (SELECT array_agg(a)
       FROM unnest(array_agg(case_parties.party_name)) a
       WHERE a IS NOT NULL) ||
      (SELECT array_agg(a)
       FROM unnest(array_agg(case_parties.firm_name)) a
       WHERE a IS NOT NULL)                               AS names,
      array_to_json(array_agg(row_to_json(case_parties))) AS parties
    FROM case_parties
    GROUP BY case_parties.case_id
  ), results AS (
    SELECT DISTINCT ON (cases.case_id)
      aaa_normalize_dispute_type(cases.dispute_type) AS normal_type,
      cases.*,
      parties.names,
      parties.parties
    FROM cases, parties
    WHERE cases.id = parties.id
    ORDER BY cases.case_id ASC, cases.import_date DESC
  )
  SELECT
    results.case_id                                       AS id,
    NULL :: VARCHAR                                       AS slug,
    'Case #' || results.case_number
    || ' involving ' || english_join(results.names)       AS index,
    to_tsvector('simple', results.case_number)
    || to_tsvector('simple', results.prevailing_party)
    || to_tsvector('simple', results.type_of_disposition)
    || to_tsvector('simple', results.arbitration_board)
    || to_tsvector('simple', results.dispute_type)
    || to_tsvector('simple', english_join(results.names)) AS vector,
    row_to_json(results) :: JSONB                         AS document
  FROM results;

CREATE OR REPLACE VIEW party_search_view AS
  WITH firms AS (
    SELECT
      attorney_firms.party_id                     AS party_id,
      array_to_json(array_agg(row_to_json(firm))) AS firms
    FROM attorney_firms, parties AS firm
    WHERE attorney_firms.firm_id = firm.id
    GROUP BY attorney_firms.party_id
  ), attorneys AS (
    SELECT
      attorney_firms.firm_id                          AS firm_id,
      array_to_json(array_agg(row_to_json(attorney))) AS attorneys
    FROM attorney_firms, parties AS attorney
    WHERE attorney_firms.party_id = attorney.id
    GROUP BY attorney_firms.firm_id
  ), case_ids AS (
    SELECT DISTINCT ON (case_id) id
    FROM cases
    ORDER BY case_id ASC, import_date DESC
  ), case_count AS (
    SELECT
      parties.id,
      count(case_ids.id) AS count
    FROM parties, case_parties, case_ids
    WHERE (parties.id = case_parties.party_id
           OR parties.id = case_parties.firm_id)
          AND case_parties.case_id = case_ids.id
    GROUP BY parties.id
  ), results AS (
    SELECT
      parties.*,
      firms.firms,
      attorneys.attorneys,
      coalesce(case_count.count, 0) AS case_count
    FROM parties
      LEFT JOIN firms ON parties.id = firms.party_id
      LEFT JOIN attorneys ON parties.id = attorneys.firm_id
      LEFT JOIN case_count ON parties.id = case_count.id
  )
  SELECT
    results.id                             AS id,
    results.slug                           AS slug,
    results.type || ' ' || results.name    AS index,
    to_tsvector('simple', results.type)
    || to_tsvector('simple', results.name) AS vector,
    row_to_json(results) :: JSONB          AS document
  FROM results;

CREATE MATERIALIZED VIEW IF NOT EXISTS search_view (
    "type",
    "id",
    "slug",
    "index",
    "vector",
    "document"
) AS
  SELECT
    'case' :: VARCHAR AS type,
    *
  FROM case_search_view
  UNION ALL
  SELECT
    'party' :: VARCHAR AS type,
    *
  FROM party_search_view
WITH NO DATA;

CREATE UNIQUE INDEX ON search_view (type, id);
CREATE INDEX IF NOT EXISTS search_view_index
  ON search_view USING GIN (vector);
CREATE INDEX IF NOT EXISTS search_view_plain_index
  ON search_view USING GIST (index gist_trgm_ops);
CREATE INDEX IF NOT EXISTS search_view_document
  ON search_view USING GIN (document);`);
};

export default Search;
