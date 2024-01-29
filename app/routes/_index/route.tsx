import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import cx from "classnames";

import { Col, Container, Row } from "~/components/Grid";
import s from "./index.module.css";
import { LoaderFunction, json } from "@remix-run/node";

import db from "~/utils/db.server";
import SummaryTable from "~/components/SummaryTable";

export const loader: LoaderFunction = async () => {
  const summaries = await db.summary_data.findMany({ where: { name: { not: "null" } } });

  return json(Object.fromEntries(summaries.map(({ name, data }) => [name, data])));
};

export default function Index() {
  const summary = useLoaderData<typeof loader>();

  return (
    <Container>
      <Row>
        <Col lg={8} className={cx(s.marginAuto)}>
          <h3 id="mission-statement">Mission Statement</h3>
          <p>
            Level Playing Field is a searchable database of consumer arbitration cases,{" "}
            <a href="https://forum.levelplayingfield.io">a forum</a> and{" "}
            <a href="https://blog.levelplayingfield.io">a blog</a>. We were formed as a 501(c)(3) so{" "}
            <a href="https://www.patreon.com/levelplayingfield">monetary donations</a> are charitable tax deductions.
          </p>
          <p>
            Use <Link to="/search">search</Link> to find specific <Link to="/search?q=is:party">Parties</Link>{" "}
            (businesses, arbitrators, attorneys, etc.) or <Link to="/search?q=is:case">Cases</Link>. For example, type
            &quot;Citibank&quot; in the search box above and hit enter. Or search for a specific arbitrator by typing
            part of their name and hitting enter. For more examples, visit our{" "}
            <Link to="/search-help">search help page.</Link>.
          </p>
          <p>You can also click &quot;Cases&quot; in the top right to browse and sort.</p>
          <p>
            <a href="https://www.patreon.com/levelplayingfield">Become a patron</a> and join{" "}
            <a href="https://forum.levelplayingfield.io">the forum</a> to support our work and the community. You will
            receive access to privileged data and analysis and can help shape our direction.
          </p>
        </Col>
      </Row>
      {summary.dispute_types ? (
        <Row>
          <Col className={s.marginAuto}>
            <SummaryTable
              className={cx(s.marginAuto, s.tableColumns)}
              heading="Dispute Types by Closing Date"
              headingQuery="type"
              data={summary.dispute_types}
            />
          </Col>
        </Row>
      ) : null}
      {summary.case_dispositions ? (
        <Row>
          <Col className={s.marginAuto}>
            <SummaryTable
              className={cx(s.marginAuto, s.tableColumns)}
              heading="Case Dispositions by Closing Date"
              headingQuery="disposition"
              data={summary.case_dispositions}
            />
          </Col>
        </Row>
      ) : null}
      {summary.case_awards && (
        <Row>
          <Col className={s.marginAuto}>
            <SummaryTable
              className={cx(s.marginAuto, s.tableColumns)}
              heading="Awarded Parties by Closing Date"
              headingQuery="awarded"
              data={summary.case_awards}
              extraTerms={{
                disposition: "awarded",
              }}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
