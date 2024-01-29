WITH firms AS (
  SELECT
    attorney_firms.party_id,
    array_to_json(array_agg(row_to_json(firm.*))) AS firms
  FROM
    attorney_firms,
    parties firm
  WHERE
    (attorney_firms.firm_id = firm.id)
  GROUP BY
    attorney_firms.party_id
),
attorneys AS (
  SELECT
    attorney_firms.firm_id,
    array_to_json(array_agg(row_to_json(attorney.*))) AS attorneys
  FROM
    attorney_firms,
    parties attorney
  WHERE
    (attorney_firms.party_id = attorney.id)
  GROUP BY
    attorney_firms.firm_id
),
case_ids AS (
  SELECT
    DISTINCT ON (cases.case_id) cases.id
  FROM
    cases
  ORDER BY
    cases.case_id,
    cases.import_date DESC
),
case_count AS (
  SELECT
    parties.id,
    count(case_ids.id) AS count
  FROM
    parties,
    case_parties,
    case_ids
  WHERE
    (
      (
        (parties.id = case_parties.party_id)
        OR (parties.id = case_parties.firm_id)
      )
      AND (case_parties.case_id = case_ids.id)
    )
  GROUP BY
    parties.id
),
results AS (
  SELECT
    parties.id,
    parties.type,
    parties.name,
    parties.slug,
    parties.aggregate_data,
    parties.created_at,
    parties.updated_at,
    firms.firms,
    attorneys.attorneys,
    COALESCE(case_count.count, (0) :: bigint) AS case_count
  FROM
    (
      (
        (
          parties
          LEFT JOIN firms ON ((parties.id = firms.party_id))
        )
        LEFT JOIN attorneys ON ((parties.id = attorneys.firm_id))
      )
      LEFT JOIN case_count ON ((parties.id = case_count.id))
    )
)
SELECT
  results.id,
  results.slug,
  (
    ((results.type) :: text || ' ' :: text) || (results.name) :: text
  ) AS INDEX,
  (
    to_tsvector('simple' :: regconfig, (results.type) :: text) || to_tsvector('simple' :: regconfig, (results.name) :: text)
  ) AS vector,
  (row_to_json(results.*)) :: jsonb AS document
FROM
  results;