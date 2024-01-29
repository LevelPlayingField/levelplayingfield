import { Link } from "@remix-run/react";
import { Col, Row } from "~/components/Grid";
import s from "./search.module.css";

export default function PartyResult({ url, Party }: any) {
  const Cell = ({ title, lg = 2, children }: any) => (
    <>
      <Col sm={3} md={3} lg={false}>
        <strong>{title}:</strong>
      </Col>
      <Col sm={9} md={8} lg={lg}>
        <Link to={url} title={title}>
          {children}
        </Link>
      </Col>
    </>
  );

  return (
    <>
      <Row className={s.resultRow}>
        <Cell lg={3} title="Party Type">
          {Party.type}
        </Cell>
        <Cell lg={3} title="Party Name">
          {Party.name}
        </Cell>

        {Party.firms ? (
          <Cell title="Firm(s)" lg={5}>
            {Party.firms.map((firm) => firm.name).join(", ")}
          </Cell>
        ) : Party.attorneys ? (
          <Cell title="Attorney(s)" lg={5}>
            {Party.attorneys.map((a) => a.name).join(", ")}
          </Cell>
        ) : (
          <Col sm={false} md={false} lg={5} />
        )}

        <Cell title="Case Count" lg={1}>
          {Party.case_count}
        </Cell>
      </Row>
    </>
  );
}
