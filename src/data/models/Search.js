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
  viewExpression: `CREATE EXTENSION IF NOT EXISTS pg_trgm;
DROP MATERIALIZED VIEW IF EXISTS search_view;
CREATE MATERIALIZED VIEW search_view (
    "type",
    "id",
    "slug",
    "vector",
    "index",
    "document"
) AS
  WITH parties AS (
    SELECT
      "case".id                                        AS id,
      english_join(array_agg("case_party".party_name)) AS party_names,
      count("case_party".party_id)                     AS number_of_parties
    FROM "case"
      LEFT JOIN case_party ON "case".id = case_party.case_id
    GROUP BY "case".id
  )
  SELECT
    'case'                                                                        AS type,
    "case".id                                                                     AS id,
    NULL                                                                          AS slug,
    to_tsvector('english', 'Case #' || "case".case_number || parties.party_names) AS vector,
    'Case #' || "case".case_number || ' involving ' || parties.party_names        AS index,
    row_to_json("case".*)                                                         AS document
  FROM "case", parties
  WHERE "case".id = parties.id
  UNION ALL
  SELECT
    'party'                                                                      AS type,
    "party".id                                                                   AS id,
    "party".slug                                                                 AS slug,
    to_tsvector('english', "party".type) || to_tsvector('english', "party".name) AS vector,
    "party".type || ' - ' || "party".name                                        AS index,
    row_to_json("party".*)                                                       AS document
  FROM "party"
WITH DATA;

CREATE INDEX search_view_index
  ON search_view USING GIN (vector);
CREATE INDEX search_view_plain_index
  ON search_view USING GIST (index gist_trgm_ops);
`,
});
Search.refreshView = function refreshView() {
  return sequelize.query('REFRESH MATERIALIZED VIEW search_view;');
};

export default Search;
