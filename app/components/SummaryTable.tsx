import { Link } from "@remix-run/react";
import cx from "classnames";

const reduceSum = (a: number, b: number): number => a + (b ?? 0);
function buildQuery(values: Record<string, string>): string {
  return encodeURIComponent(
    Object.entries(values)
      .map(([key, value]) => `${key}:"${value}"`)
      .join(" ")
  );
}

export default function SummaryTable({
  data,
  heading,
  headingQuery,
  extraTerms,
  className,
}: {
  data: Record<string, Record<string, number>>;
  heading: string;
  headingQuery: string;
  extraTerms?: Record<string, string>;
  className?: cx.Argument;
}) {
  const years = Object.keys(data);
  const headings = years
    .flatMap((y) => Object.keys(data[y]))
    .reduce<string[]>((set, val) => {
      if (!set.includes(val)) {
        set.push(val);
      }
      return set;
    }, []);

  return (
    <table className={cx(className)}>
      <caption>{heading}</caption>
      <thead>
        <tr>
          <th />
          {years.map((year) => (
            <th key={year}>{year}</th>
          ))}
          {years.length > 1 && <th>Total</th>}
        </tr>
      </thead>
      <tbody>
        {headings.map((h) => (
          <tr key={h}>
            <th>{h}</th>
            {years.map((y) => (
              <td key={y}>
                {data[y][h] ? (
                  <Link
                    to={`/search?q=${buildQuery({ [headingQuery]: h, closed: `1/1/${y}-12/31/${y}`, ...extraTerms })}`}
                  >
                    {data[y][h]}
                  </Link>
                ) : null}
              </td>
            ))}
            {years.length > 1 && (
              <td>
                <Link
                  to={`/search?q=${buildQuery({
                    [headingQuery]: h,
                    ...extraTerms,
                  })}`}
                >
                  {years.map((y) => data[y][h]).reduce(reduceSum, 0)}
                </Link>
              </td>
            )}
          </tr>
        ))}
        {headings.length > 1 && (
          <tr>
            <th>Total</th>
            {years.map((y) => (
              <td key={y}>
                <Link to={`/search?q=${buildQuery({ closed: `1/1/${y}-12/31/${y}`, ...extraTerms })}`}>
                  {Object.values(data[y]).reduce(reduceSum, 0)}
                </Link>
              </td>
            ))}
            {years.length > 1 && <td>{years.flatMap((y) => headings.map((h) => data[y][h])).reduce(reduceSum, 0)}</td>}
          </tr>
        )}
      </tbody>
    </table>
  );
}
