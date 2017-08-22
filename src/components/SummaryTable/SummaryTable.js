/* @flow */
import React from 'react';
import Helmet from 'react-helmet';

import Link from '../Link';

import s from './SummaryTable.scss';

type DataSet = {
  [key: string]: {
    [key: string]: number
  }
};
type Terms = {[key: string]: string};
type Props = {
  heading: string,
  headingQuery: string,
  extraTerms?: Terms,
  data: DataSet,
};

const notNull = d => d != null;
const flattenArrays = (a: Array<any>, b: Array<any>) => (notNull(b) ? [...a, ...b] : a);
const sumReduce = (a: number, b: number) => (notNull(b) ? a + b : a);

function values<T>(a: { [key: any]: T }): Array<T> {
  return Object.keys(a).map(k => a[k]);
}

function buildQuery(values: { [key: string]: string }): string {
  let query = [];

  Object.keys(values).forEach(key => {
    let value = values[key];

    if (value.indexOf(" ") !== -1) {
      value = `"${value}"`;
    }

    query.push(`${key}:${value}`)
  });

  return encodeURIComponent(query.join(' '));
}

const SummaryTable = ({data, heading, headingQuery, extraTerms}: Props) => {
  const years = Object.keys(data);
  const headings = years
    .map(y => Object.keys(data[y]))
    .reduce((set: Array<string>, vals: Array<string> = []) => {
      vals.map(a => set.indexOf(a) === -1 && set.push(a));
      return set;
    });

  return (
    <table className={s.summaryTable}>
      <Helmet style={[{type: 'text/css', cssText: s._getCss()}]}/>
      <caption>{heading}</caption>
      <thead>
      <tr>
        <th/>
        {years.map(y => (
          <th key={`th-${y}`}>
            {y}
          </th>
        ))}
        {years.length > 1 && (
          <th>Total</th>
        )}
      </tr>
      </thead>
      <tbody>
      {headings.map(h => (
        <tr key={`tr-${h}`}>
          <th>
            {h}
          </th>
          {years.map(y => (
            <td key={`td-${h}-${y}`}>
              {data[y][h]
                ? <Link
                  to={`/search?q=${buildQuery({closed: `1/1/${y}-12/31/${y}`, [headingQuery]: h, ...extraTerms})}`}>{data[y][h]}</Link>
                : null}
            </td>
          ))}

          {years.length > 1 && (
            <td>
              <Link to={`/search?q=${buildQuery({[headingQuery]: h, ...extraTerms})}`}>
                {years.map(y => data[y][h]).reduce(sumReduce, 0)}
              </Link>
            </td>
          )}
        </tr>
      ))}
      {headings.length > 1 && (
        <tr>
          <th>Total</th>
          {years.map(y => (
            <td key={`td-total-${y}`}>
              <Link to={`/search?q=${buildQuery({closed: `1/1/${y}-12/31/${y}`, ...extraTerms})}`}>
                {values(data[y]).reduce(sumReduce, 0)}
              </Link>
            </td>
          ))}

          {years.length > 1 && (
            <td>
              {years.map(y => headings.map(h => data[y][h]))
                .reduce(flattenArrays, [])
                .reduce(sumReduce, 0)}
            </td>
          )}
        </tr>
      )}
      </tbody>
    </table>
  );
};

export default SummaryTable;
