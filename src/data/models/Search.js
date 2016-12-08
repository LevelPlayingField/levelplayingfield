/* @flow */
import Sequelize from 'sequelize';
import sequelize from '../sequelize';

const Search = sequelize.define('search_view', {
  type: { type: Sequelize.STRING(32), primaryKey: true },
  id: { type: Sequelize.INTEGER, primaryKey: true },
  slug: Sequelize.STRING(255),
  document: Sequelize.JSON,
  vector: Sequelize.STRING,
  index: Sequelize.STRING,
}, {
  createdAt: false,
  updatedAt: false,
  view: true,
});
Search.refreshView = function refreshView() {
  return sequelize.query('REFRESH MATERIALIZED VIEW search_view;');
};
Search.sync = function sync() {
  // language=PostgreSQL
  return sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;
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

CREATE OR REPLACE VIEW case_search_view AS
  WITH parties AS (
    SELECT
      case_party.case_id                                AS id,
      (SELECT array_agg(a)
       FROM unnest(array_agg(case_party.party_name)) a
       WHERE a IS NOT NULL) ||
      (SELECT array_agg(a)
       FROM unnest(array_agg(case_party.firm_name)) a
       WHERE a IS NOT NULL)                             AS names,
      array_to_json(array_agg(row_to_json(case_party))) AS parties
    FROM case_party
    GROUP BY "case_party".case_id
  ), results AS (
    SELECT DISTINCT ON ("case".case_id)
      "case".*,
      parties.names,
      parties.parties
    FROM "case", parties
    WHERE "case".id = parties.id
    ORDER BY "case".case_id ASC, "case".import_date DESC
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
    FROM attorney_firms, party AS firm
    WHERE attorney_firms.firm_id = firm.id
    GROUP BY attorney_firms.party_id
  ), attorneys AS (
    SELECT
      attorney_firms.firm_id                          AS firm_id,
      array_to_json(array_agg(row_to_json(attorney))) AS attorneys
    FROM attorney_firms, party AS attorney
    WHERE attorney_firms.party_id = attorney.id
    GROUP BY attorney_firms.firm_id
  ), case_count AS (
    SELECT
      party_id,
      count(case_id) AS count
    FROM case_party
    GROUP BY party_id
  ), results AS (
    SELECT
      party.*,
      firms.firms,
      attorneys.attorneys,
      case_count.count AS case_count
    FROM party
      LEFT JOIN firms ON party.id = firms.party_id
      LEFT JOIN attorneys ON party.id = attorneys.firm_id
      LEFT JOIN case_count ON party.id = case_count.party_id
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
