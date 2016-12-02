/* @flow */
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './SummaryTable.scss';

type DataSet = {
  [key: string]: {
    [key: string]: number
  }
};

const notNull = d => d != null;
const flattenArrays = (a: Array<any>, b: Array<any>) => (notNull(b) ? [...a, ...b] : a);
const sumReduce = (a: number, b: number) => (notNull(b) ? a + b : a);

function values<T>(a: {[key: any]: T}): Array<T> {
  return Object.keys(a).map(k => a[k]);
}

const SummaryTable = ({ data, heading }: {heading: string, data: DataSet}) => {
  const years = Object.keys(data);
  const headings = years
    .map(y => Object.keys(data[y]))
    .reduce((set: Array<string>, vals: Array<string> = []) => {
      vals.map(a => set.indexOf(a) === -1 && set.push(a));
      return set;
    });

  return (
    <table className={s.summaryTable}>
      <caption>{heading}</caption>
      <thead>
        <tr>
          <th/>
          {years.map(y => <th key={`th-${y}`}>{y}</th>)}
          {years.length > 1 && (
            <th>Total</th>
          )}
        </tr>
      </thead>
      <tbody>
        {headings.map(h => (
          <tr key={`tr-${h}`}>
            <th>{h}</th>
            {years.map(y => (
              <td key={`td-${h}-${y}`}>
                {data[y][h] || null}
              </td>
            ))}

            {years.length > 1 && (
              <td>
                {years.map(y => data[y][h]).reduce(sumReduce, 0)}
              </td>
            )}
          </tr>
        ))}
        {headings.length > 1 && (
          <tr>
            <th>Total</th>
            {years.map(y => (
              <td key={`td-total-${y}`}>
                {values(data[y]).reduce(sumReduce, 0)}
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

export default withStyles(s)(SummaryTable);
