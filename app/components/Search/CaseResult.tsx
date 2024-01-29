import { Link } from "@remix-run/react";
import { Col, Row } from "~/components/Grid";
import { PartyType, first, formatDate, partyType } from "~/utils/cases";
import s from "./search.module.css";

export default function CaseResult({ url, Case }: any) {
  const Cell = ({ title, lg = 2, children }: any) => (
    <>
      <Col sm={4} md={4} lg={false}>
        <strong>{title}:</strong>
      </Col>
      <Col sm={8} md={8} lg={lg}>
        <Link to={url} title={title}>
          {children}
        </Link>
      </Col>
    </>
  );

  const initiatedBy = partyType(Case.initiating_party);
  const consumer = {
    attorneys: Case.parties.filter((party) => party.type === "Attorney"),
    party_name: "Consumer",
  };
  const nonConsumer = first(Case.parties.filter((party) => party.type === "Non Consumer"));
  const arbitrators = Case.parties.filter((party) => party.type === "Arbitrator").sort((a) => new Date(a.date));
  const [plaintiff, defendant] =
    initiatedBy === PartyType.NonConsumer ? [nonConsumer, consumer] : [consumer, nonConsumer];

  return (
    <>
      <Row className={s.resultRow}>
        <Cell title="Case #">{Case.case_number}</Cell>
        <Cell title="Plaintiff">{plaintiff.party_name}</Cell>
        <Cell title="Defendant">{defendant.party_name}</Cell>
        <Cell title="Arbitration Board">{Case.arbitration_board}</Cell>
        <Cell title="Disposition">{Case.type_of_disposition}</Cell>
        <Cell title="Filed" lg={1}>
          {formatDate(Case.filing_date)}
        </Cell>
        <Cell title="Dispute Type" lg={3}>
          {Case.dispute_type}
        </Cell>
        {plaintiff.attorneys ? (
          <Cell title="Plaintiff Attorneys">
            {plaintiff.attorneys.map((a) => `${a.party_name} - ${a.firm_name}`).join(", ")}
          </Cell>
        ) : (
          <Col sm={false} md={false} lg={2}>
            ---
          </Col>
        )}
        {defendant.attorneys ? (
          <Cell title="Defendant Attorneys">
            {defendant.attorneys.map((a) => `${a.party_name} - ${a.firm_name}`).join(", ")}
          </Cell>
        ) : (
          <Col sm={false} md={false} lg={2}>
            ---
          </Col>
        )}

        <Cell title="Arbitrators">{"..."}</Cell>
        {Case.prevailing_party === "---" ? (
          <Col sm={false} md={false} lg={2} />
        ) : (
          <Cell title="Awardee">{Case.prevailing_party}</Cell>
        )}
        <Cell title="Closed" lg={1}>
          {formatDate(Case.close_date)}
        </Cell>
      </Row>
    </>
  );
}
