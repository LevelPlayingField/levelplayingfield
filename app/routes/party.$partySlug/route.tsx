import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import db from "~/utils/db.server";
import { Container, Col, Row } from "~/components/Grid";
import s from "./party.module.css";
import SummaryTable from "~/components/SummaryTable";
import Prisma from "@prisma/client";

export async function loader({ params }: LoaderFunctionArgs) {
  const party = await db.parties.findFirstOrThrow({
    where: { slug: params.partySlug! },
    include: {
      firms: { include: { firm: true, party: true } },
      attornies: { include: { firm: true, party: true } },
    },
  });

  return json({ party });
}

export default function Party() {
  const { party } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Row>
        <Col>
          <h1 className={s.title}>
            <Link to={`/search?q=${encodeURIComponent(`is:case party:${JSON.stringify(party.name)}`)}`}>
              {party.name}
            </Link>
            <small className={s.titleMuted}>{party.type}</small>
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <PartySummary party={party} />
        </Col>
        <Col>
          <PartyDetails party={party} />
        </Col>
      </Row>
    </Container>
  );
}

type PartyProp = { party: Prisma.parties & { firms: Prisma.attorney_firms[]; attornies: Prisma.attorney_firms[] } };

function PartySummary({ party }: PartyProp) {
  if (!party.aggregate_data) {
    return null;
  }

  return (
    <>
      <Row className={s.rowMargin}>
        <Col className={s.alignCenter}>
          {party.aggregate_data.types && (
            <SummaryTable
              data={party.aggregate_data.types}
              heading="Dispute Types"
              headingQuery="type"
              extraTerms={{
                party: party.name,
              }}
            />
          )}
        </Col>
      </Row>

      <Row className={s.rowMargin}>
        <Col className={s.alignCenter}>
          {party.aggregate_data.dispositions && (
            <SummaryTable
              data={party.aggregate_data.dispositions}
              heading="Dispositions"
              headingQuery="disposition"
              extraTerms={{
                party: party.name,
              }}
            />
          )}
        </Col>
      </Row>

      <Row className={s.rowMargin}>
        <Col className={s.alignCenter}>
          {party.aggregate_data.awards && (
            <SummaryTable
              data={party.aggregate_data.awards}
              heading="Awards"
              headingQuery="awarded"
              extraTerms={{
                party: party.name,
                disposition: "awarded",
              }}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
function PartyDetails({ party }: PartyProp) {
  switch (party.type) {
    case "Law Firm":
      return <LawFirmDetails party={party} />;

    case "Attorney":
      return <AttorneyDetails party={party} />;

    default:
      return null;
  }
}

function LawFirmDetails({ party }: PartyProp) {
  return (
    <>
      <h4 className={s.subtitle}>Attorneys</h4>

      <ul className={s.parties}>
        {party.attornies.map((attorney) => (
          <PartyItem party={attorney.party} key={`attorney_${attorney.party_id}`} />
        ))}
      </ul>
    </>
  );
}
function AttorneyDetails({ party }: PartyProp) {
  return (
    <>
      <h4 className={s.subtitle}>Law Firms</h4>

      <ul className={s.parties}>
        {party.firms.map((firm) => (
          <PartyItem party={firm.firm} key={`firm_${firm.firm.id}`} />
        ))}
      </ul>
    </>
  );
}

function PartyItem({ party }: { party: Prisma.parties }) {
  return (
    <Link to={`/party/${party.slug}`}>
      {party.type} - {party.name}
    </Link>
  );
}
