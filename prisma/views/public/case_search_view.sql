WITH parties AS (
  SELECT
    case_parties.case_id AS id,
    (
      (
        SELECT
          array_agg(a.a) AS array_agg
        FROM
          unnest(array_agg(case_parties.party_name)) a(a)
        WHERE
          (a.a IS NOT NULL)
      ) || (
        SELECT
          array_agg(a.a) AS array_agg
        FROM
          unnest(array_agg(case_parties.firm_name)) a(a)
        WHERE
          (a.a IS NOT NULL)
      )
    ) AS NAMES,
    array_to_json(array_agg(row_to_json(case_parties.*))) AS parties
  FROM
    case_parties
  GROUP BY
    case_parties.case_id
),
results AS (
  SELECT
    DISTINCT ON (cases.case_id) aaa_normalize_dispute_type((cases.dispute_type) :: text) AS normal_type,
    cases.id,
    cases.case_id,
    cases.import_date,
    cases.unique_value,
    cases.case_number,
    cases.arbitration_board,
    cases.initiating_party,
    cases.source_of_authority,
    cases.dispute_type,
    cases.dispute_subtype,
    cases.salary_range,
    cases.prevailing_party,
    cases.filing_date,
    cases.close_date,
    cases.type_of_disposition,
    cases.claim_amount_business,
    cases.fee_allocation_business,
    cases.fees_business,
    cases.award_amount_business,
    cases.attorney_fees_business,
    cases.other_relief_business,
    cases.claim_amount_consumer,
    cases.fee_allocation_consumer,
    cases.fees_consumer,
    cases.award_amount_consumer,
    cases.attorney_fees_consumer,
    cases.other_relief_consumer,
    cases.consumer_rep_state,
    cases.consumer_self_represented,
    cases.document_only_proceeding,
    cases.type_of_hearing,
    cases.hearing_addr1,
    cases.hearing_addr2,
    cases.hearing_city,
    cases.hearing_state,
    cases.hearing_zip,
    cases.arb_count,
    cases.med_count,
    cases.arb_or_cca_count,
    cases.adr_process,
    cases.created_at,
    cases.updated_at,
    parties.names,
    parties.parties
  FROM
    cases,
    parties
  WHERE
    (cases.id = parties.id)
  ORDER BY
    cases.case_id,
    cases.import_date DESC
)
SELECT
  results.case_id AS id,
  NULL :: character varying AS slug,
  (
    (
      ('Case #' :: text || (results.case_number) :: text) || ' involving ' :: text
    ) || (english_join(results.names)) :: text
  ) AS INDEX,
  (
    (
      (
        (
          (
            to_tsvector('simple' :: regconfig, (results.case_number) :: text) || to_tsvector(
              'simple' :: regconfig,
              (results.prevailing_party) :: text
            )
          ) || to_tsvector(
            'simple' :: regconfig,
            (results.type_of_disposition) :: text
          )
        ) || to_tsvector(
          'simple' :: regconfig,
          (results.arbitration_board) :: text
        )
      ) || to_tsvector(
        'simple' :: regconfig,
        (results.dispute_type) :: text
      )
    ) || to_tsvector(
      'simple' :: regconfig,
      (english_join(results.names)) :: text
    )
  ) AS vector,
  (row_to_json(results.*)) :: jsonb AS document
FROM
  results;