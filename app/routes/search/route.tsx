import { Prisma } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import cx from "classnames";
import qs from "querystring";
import { PropsWithChildren } from "react";
import { FaSearch, FaSort, FaSortDown, FaSortUp, FaSpinner } from "react-icons/fa";
import { Col, Container, Row } from "~/components/Grid";
import CaseResult from "~/components/Search/CaseResult";
import PartyResult from "~/components/Search/PartyResult";
import s from "~/components/Search/search.module.css";
import { parse as parseQuery } from "~/search/parser";
import { CaseDocument } from "~/types/CaseSearch";
import { PartyDocument } from "~/types/PartySearch";
import { first } from "~/utils/cases";
import db from "~/utils/db.server";

const mapLower = (a: string[]) => a.map((v) => v.toLowerCase());

type SearchResult =
  | { type: "party"; id: number; slug: string; index: string; document: PartyDocument }
  | { type: "case"; id: number; slug: string; index: string; document: CaseDocument };

const perPage = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const query = parseQuery(url.searchParams.get("q") ?? "");
  const page = parseInt(url.searchParams.get("page") ?? "1");

  const sortBy = url.searchParams.get("sortBy");
  const sortDir = url.searchParams.get("sortDir");

  const filters: Prisma.Sql[] = [];

  if (query.is?.length) {
    filters.push(Prisma.sql`lower(type) in (${Prisma.join(mapLower(query.is))})`);
  }
  if (query.type?.length) {
    filters.push(Prisma.sql`lower(document->>'normal_type') in (${Prisma.join(mapLower(query.type))})`);
  }
  if (query.state?.length) {
    filters.push(Prisma.sql`lower(document->>'consumer_rep_state') IN (${Prisma.join(mapLower(query.state))})`);
  }
  if (query.board?.length) {
    filters.push(Prisma.sql`lower(document->>'arbitration_board') IN (${Prisma.join(mapLower(query.board))})`);
  }
  if (query.disposition?.length) {
    filters.push(Prisma.sql`lower(document->>'type_of_disposition') IN (${Prisma.join(mapLower(query.disposition))})`);
  }
  if (query.party?.length) {
    filters.push(
      Prisma.join(
        query.party.map((p) => Prisma.sql`document->'names' ? ${p}`),
        " OR "
      )
    );
  }
  if (query.filed) {
    filters.push(Prisma.sql`(document->>'filing_date')::DATE BETWEEN ${query.filed.from} and ${query.filed.to}`);
  }
  if (query.closed) {
    filters.push(Prisma.sql`(document->>'close_date')::DATE BETWEEN ${query.closed.from} and ${query.closed.to}`);
  }

  const { count = 0 } = first(
    await db.$queryRaw<{ count: number }[]>`
      SELECT 
      COUNT(*) :: INT as "count"
      FROM "search_view"
      ${Prisma.join(filters, " AND ", "WHERE ")}
    `
  )!;

  // TODO: I think I could do this easier with Prisma.join over an array of Prisma.sql
  const results = await db.$queryRaw<Array<SearchResult>>`
    SELECT 
        "type"
        , "id"
        , "slug"
        , "index"
        , "document"
    FROM "search_view"
    ${Prisma.join(filters, " AND ", "WHERE ")}
    ORDER BY
      ${
        sortBy != null
          ? Prisma.sql`document->${sortBy.replace("'", "''")} ${Prisma.raw(
              sortDir?.toLowerCase() == "asc" ? "ASC" : "DESC"
            )},`
          : Prisma.empty
      }
      id asc
      
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
  `;

  return json({ results, page, pages: Math.ceil(count / perPage), count });
}

export default function Search() {
  const { results, page, pages } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = searchParams.get("q") ?? "";
  const query = parseQuery(queryString);

  const Heading = ({ lg, sortBy, children }: PropsWithChildren<{ lg: number; sortBy?: string }>) => (
    <Col sm={false} md={false} lg={lg} className={s.heading}>
      {sortBy != null ? (
        <Link
          to={`?${qs.stringify({
            ...Object.fromEntries(searchParams.entries()),
            page: "1",
            sortBy,
            sortDir: searchParams.get("sortDir") == "asc" ? "desc" : "asc",
          })}`}
        >
          {children}

          {searchParams.get("sortBy") == sortBy ? (
            searchParams.get("sortDir") == "asc" ? (
              <FaSortDown size=".7em" />
            ) : (
              <FaSortUp size=".7em" />
            )
          ) : (
            <FaSort size=".7em" color="#888" />
          )}
        </Link>
      ) : (
        children
      )}
    </Col>
  );

  return (
    <Container>
      <Row centerMd centerLg>
        <Col sm={12} md={8} lg={6} className={s.centerText}>
          <input
            type="search"
            className={s.searchField}
            defaultValue={queryString}
            onBlur={(e) =>
              setSearchParams((p) => {
                p.set("q", e.currentTarget.value);
                return p;
              })
            }
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                setSearchParams((p) => {
                  p.set("q", e.currentTarget.value);
                  return p;
                });
              }
            }}
          />
          <FaSearch />
        </Col>
      </Row>

      <Row>
        <Col className={cx(s.centerText, s.padding1)}>
          <FaSpinner
            size="2em"
            className={s.rotateIcon}
            style={{ visibility: navigation.state != "idle" ? "visible" : "hidden" }}
          />
        </Col>
      </Row>

      {query.is?.includes("party") && (
        <Row className={cx(s.resultRow, s.heading)}>
          <Heading lg={3} sortBy="type">
            Party Type
          </Heading>
          <Heading lg={3} sortBy="name">
            Party Name
          </Heading>
          <Heading lg={5}>Firm(s)/Attorney(s)</Heading>
          <Heading lg={1} sortBy="">
            Cases
          </Heading>
        </Row>
      )}

      {query.is?.includes("case") && (
        <Row className={cx(s.resultRow, s.heading)}>
          <Heading lg={2} sortBy="case_number">
            Case #
          </Heading>
          <Heading lg={2}>Plaintiff</Heading>
          <Heading lg={2}>Defendant</Heading>
          <Heading lg={2}>Arbitration Board</Heading>
          <Heading lg={2} sortBy="type_of_disposition">
            Disposition
          </Heading>
          <Heading lg={1} sortBy="filing_date">
            Filed
          </Heading>
          <Heading lg={3} sortBy="dispute_type">
            Dispute Type
          </Heading>
          <Heading lg={2}>Plaintiff Attorneys</Heading>
          <Heading lg={2}>Defendant Attorneys</Heading>
          <Heading lg={2}>Arbitrators</Heading>
          <Heading lg={2} sortBy="prevailing_party">
            Awardee
          </Heading>
          <Heading lg={1} sortBy="close_date">
            Closed
          </Heading>
        </Row>
      )}

      {results.map((r) => (
        <Row key={r.id}>
          <Col>
            {r.type === "case" ? (
              <CaseResult url={`/case/${r.id}`} Case={r.document} />
            ) : r.type === "party" ? (
              <PartyResult url={`/party/${r.slug}`} Party={r.document} />
            ) : (
              <code>{JSON.stringify(r, null, 2)}</code>
            )}
          </Col>
        </Row>
      ))}

      <Row>
        <Col>
          <ul className={s.pagination}>
            {page > 2 && (
              <li>
                <Link to={`?${qs.stringify({ ...Object.fromEntries(searchParams.entries()), page: 1 })}`}>
                  First {perPage}
                </Link>
              </li>
            )}

            <li>
              {page > 1 ? (
                <Link to={`?${qs.stringify({ ...Object.fromEntries(searchParams.entries()), page: page - 1 })}`}>
                  Previous {perPage}
                </Link>
              ) : (
                <span>Previous {perPage}</span>
              )}
            </li>

            <li>
              <span>
                Page {page} of {pages}
              </span>
            </li>

            <li>
              {page < pages ? (
                <Link to={`?${qs.stringify({ ...Object.fromEntries(searchParams.entries()), page: page + 1 })}`}>
                  Next {perPage}
                </Link>
              ) : (
                <span>Next {perPage}</span>
              )}
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
