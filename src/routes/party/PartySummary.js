/* @flow */
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from '../../components/Grid';

import s from './Party.scss';
import type { PartyType } from './';

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

const PartySummary = ({ party }: { party: PartyType }) => {
  if (!party.aggregate_data) {
    return null;
  }

  return (
    <Row>
      <Col className={s.alignCenter}>
        {party.aggregate_data.dispositions && (
          <SummaryTable data={party.aggregate_data.dispositions} heading="Dispositions"/>
        )}
      </Col>
      <Col className={s.alignCenter}>
        {party.aggregate_data.awards && (
          <SummaryTable data={party.aggregate_data.awards} heading="Awards"/>
        )}
      </Col>
    </Row>
  );
};

export default withStyles(s)(PartySummary);
