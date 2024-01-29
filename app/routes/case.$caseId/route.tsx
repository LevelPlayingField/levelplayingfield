import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { Col, Container, Row } from "~/components/Grid";
import db from "~/utils/db.server";
import AwardsTable from "~/routes/case.$caseId/AwardsTable";
import { case_parties, cases, parties } from "@prisma/client";
import { PartyType, first, partyType, formatDate, days, CONSUMER_PARTY } from "~/utils/cases";

import s from "./case.module.css";
export * from "./case.module.css";

export async function loader({ params }: LoaderFunctionArgs) {
  const case_id = parseInt(params.caseId ?? "0");
  const caseData = await db.cases.findUnique({
    where: { case_id },
    include: {
      case_parties: {
        include: {
          party: true,
          firm: true,
        },
      },
    },
  });

  return json({ case: caseData }, { status: caseData === null ? 404 : 200 });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data?.case == null) {
    return [];
  }

  const description = `${data.case.arbitration_board} Case #${data.case.case_number}, involving [[TODO]]`;

  return [
    { title: `${data.case.arbitration_board} Case #${data.case.case_number} - Level Playing Field` },
    { name: "og:description", content: description },
    { name: "description", content: description },
  ];
};

function renderAttorneys(attorneys: (case_parties & { party: parties; firm: parties })[]) {
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h4 className={s.heading}>Represented By</h4>
          </Col>
        </Row>

        {attorneys ? (
          attorneys.map((attorney) => (
            <Row key={`attorney_${attorney.party.id}`}>
              <Col>
                <strong className={s.title}>
                  <Link to={`/party/${attorney.party.slug}`}>{attorney.party.name}</Link>
                </strong>

                {attorney.firm && (
                  <div className={s.detail}>
                    <Link to={`/party/${attorney.firm.slug}`}>{attorney.firm.name}</Link>
                  </div>
                )}
              </Col>
            </Row>
          ))
        ) : (
          <Row>
            <Col>
              <strong>Unknown</strong>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
export default function Case() {
  const data = useLoaderData<typeof loader>();
  const case_ = data.case as cases & { case_parties: (case_parties & { party: parties })[] };

  const initiatedBy = partyType(case_.initiating_party);
  const parties = case_.case_parties;

  const nonConsumer = first(parties.filter((p) => p.party.type === "Non Consumer")).party;
  const attorneys = parties.filter((p) => p.party.type == "Attorney");
  const arbitrators = parties.filter((p) => p.party.type === "Arbitrator").sort((a) => a.date);
  const firstArbitrator = first(arbitrators);

  const plaintiff = initiatedBy == PartyType.NonConsumer ? nonConsumer : { ...CONSUMER_PARTY, attorneys };
  const defendant = initiatedBy == PartyType.Consumer ? nonConsumer : { ...CONSUMER_PARTY, attorneys };

  return (
    <Container>
      <Row>
        <Col md={4} lg={4}>
          <Row>
            <Col>
              <strong>Forum </strong> {data.case.arbitration_board}
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Case ID </strong> {data.case.case_number}
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>State </strong> {data.case.consumer_rep_state || "Unknown"}
            </Col>
          </Row>
        </Col>

        <Col md={4} lg={4}>
          <Row>
            <Col>
              <strong>Filed</strong> {formatDate(data.case.filing_date)}
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Closed</strong> {formatDate(data.case.close_date)}
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Open</strong>{" "}
              {days(new Date(data.case.close_date).getTime() - new Date(data.case.filing_date).getTime())} Days
            </Col>
          </Row>
        </Col>

        <Col md={4} lg={4}>
          {firstArbitrator !== null ? (
            <div>
              <Row>
                <Col>
                  <strong>Filing to appointment</strong>&nbsp;
                  {days(new Date(firstArbitrator.date) - new Date(case_.filing_date))} Days
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Appointment to close</strong>&nbsp;
                  {days(new Date(case_.close_date) - new Date(firstArbitrator.date))} Days
                </Col>
              </Row>
            </div>
          ) : (
            <span>&nbsp;</span>
          )}
        </Col>
      </Row>

      <Row>
        {case_.dispute_type && (
          <Col md={4} lg={4}>
            <strong>Type</strong> {case_.dispute_type}
          </Col>
        )}

        {case_.dispute_subtype && (
          <Col md={4} lg={4}>
            <strong>Subtype</strong> {case_.dispute_subtype}
          </Col>
        )}

        {case_.salary_range && (
          <Col md={4} lg={4}>
            <strong>Salary Range</strong> {case_.salary_range}
          </Col>
        )}
      </Row>
      <Row className={s.rowSpaced}>
        <Col md={4} lg={4}>
          <h4 className={s.subtitle}>Disposition</h4>
          <p className={s.details}>{case_.type_of_disposition}</p>
        </Col>
        <Col md={4} lg={4}>
          <h4 className={s.subtitle}>Prevailing Party</h4>
          <p className={s.details}>{case_.prevailing_party}</p>
        </Col>
        <Col md={4} lg={4} />
      </Row>

      <Row className={s.rowSpaced}>
        <Col>
          {initiatedBy && <h2 className={s.subtitle}>Plaintiff</h2>}
          {plaintiff.slug ? (
            <h3>
              <Link to={`/party/${plaintiff.slug}`}>{plaintiff.name}</Link>
            </h3>
          ) : (
            <h3>{plaintiff.name}</h3>
          )}

          {renderAttorneys(plaintiff.attorneys)}
        </Col>

        <Col>
          {initiatedBy && <h2 className={s.subtitle}>Defendant</h2>}
          {defendant.slug ? (
            <h3>
              <Link to={`/party/${defendant.slug}`}>{defendant.name}</Link>
            </h3>
          ) : (
            <h3>{defendant.name}</h3>
          )}

          {renderAttorneys(defendant.attorneys)}
        </Col>

        <Col>
          <h2 className={s.subtitle}>{arbitrators.length === 1 ? "Arbitrator" : "Arbitrators"}</h2>
          {arbitrators.length > 0 ? (
            arbitrators.map((arbitrator) => (
              <Row key={`arbitrator_${arbitrator.party.id}`}>
                <Col>
                  <h3>
                    <Link to={`/party/${arbitrator.party.slug}`}>{arbitrator.party.name}</Link>
                  </h3>
                  <p className={s.details}>
                    Appointed{" "}
                    {new Date(arbitrator.date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                  </p>
                </Col>
              </Row>
            ))
          ) : (
            <Row>
              <Col>
                <h3 className={s.title}>Unknown</h3>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      <Row className={s.rowSpaced}>
        <Col md={6} lg={6}>
          <AwardsTable case_={case_} />
        </Col>

        <Col md={6} lg={6}>
          <dl className={s.dl_horizontal}>
            <dt>Arbitration Details</dt>
            <dd />
            <dt>Hearing</dt>
            <dd>{case_.type_of_hearing ? "Yes" : "No Hearing"}</dd>
            {case_.type_of_hearing && [<dt key={1}>Hearing Type</dt>, <dd key={2}>{case_.type_of_hearing}</dd>]}
            {case_.document_only_proceeding && [
              <dt key={1}>Documents Only</dt>,
              <dd key={2}>{case_.document_only_proceeding}</dd>,
            ]}
            {case_.hearing_state && [
              <dt key={1}>Hearing Location</dt>,
              <dd key={2}>{`${case_.hearing_city}, ${case_.hearing_state}`}</dd>,
            ]}
          </dl>

          <dl className={s.dl_horizontal}>
            <dt>Other Data</dt>
            <dd />
            <dt>Consumer Cases Involving Business</dt>
            <dd>{case_.arb_count}</dd>
            <dt>Mediated Cases Involving Business</dt>
            <dd>{case_.med_count}</dd>
            <dt>Arbitrations Involving Business</dt>
            <dd>{case_.arb_or_cca_count}</dd>
            <dt>Source of Authority</dt>
            <dd>{case_.source_of_authority}</dd>
          </dl>
        </Col>
      </Row>

      <Debug>
        <Row>
          <Col>
            <pre>{JSON.stringify(data.case, null, 2)}</pre>
          </Col>
        </Row>
      </Debug>
    </Container>
  );
}
