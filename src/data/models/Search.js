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
Search.sync = async function sync(): Promise<*> {
  // language=PostgreSQL
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE OR REPLACE FUNCTION english_join(character varying[])
  RETURNS character varying AS
$BODY$
DECLARE 
  length INTEGER;
BEGIN
  length := array_length($1, 1);
  IF length = 1 THEN
    return ($1)[1];
  ELSIF length = 2 THEN
    return array_to_string($1, ' and ', 'Unknown');
  ELSE
    return array_to_string(($1)[1:length - 1], ', ', 'Unknown') || ', and ' || ($1)[length];
  END IF;
END $BODY$
LANGUAGE plpgsql;
  
CREATE OR REPLACE VIEW case_search_view AS
  WITH parties AS (
    SELECT
      case_party.case_id                                AS id,
      array_agg(case_party.party_name)                  AS names,
      array_to_json(array_agg(row_to_json(case_party))) AS parties
    FROM case_party
    GROUP BY "case_party".case_id
  ), results AS (
    SELECT
      "case".*,
      parties.names,
      parties.parties
    FROM "case", parties
    WHERE "case".id = parties.id
  )
  SELECT
    results.id                                             AS id,
    NULL :: VARCHAR                                        AS slug,
    'Case #' || results.case_number
    || ' involving ' || english_join(results.names)        AS index,
    to_tsvector('english', results.case_number)
    || to_tsvector('english', results.prevailing_party)
    || to_tsvector('english', results.type_of_disposition)
    || to_tsvector('english', results.arbitration_board)
    || to_tsvector('english', results.dispute_type)
    || to_tsvector('english', english_join(results.names)) AS vector,
    row_to_json(results) :: JSONB                          AS document
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
  ), results AS (
    SELECT
      party.*,
      firms.firms,
      attorneys.attorneys
    FROM party
      LEFT JOIN firms ON party.id = firms.party_id
      LEFT JOIN attorneys ON party.id = attorneys.firm_id
  )
  SELECT
    results.id                              AS id,
    results.slug                            AS slug,
    results.type || ' ' || results.name     AS index,
    to_tsvector('english', results.type)
    || to_tsvector('english', results.name) AS vector,
    row_to_json(results) :: JSONB           AS document
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
WITH DATA;

CREATE UNIQUE INDEX ON search_view (type, id);
CREATE INDEX IF NOT EXISTS search_view_index
  ON search_view USING GIN (vector);
CREATE INDEX IF NOT EXISTS search_view_plain_index
  ON search_view USING GIST (index gist_trgm_ops);
CREATE INDEX IF NOT EXISTS search_view_document 
  ON search_view USING GIN (document);
`);
};

export default Search;
