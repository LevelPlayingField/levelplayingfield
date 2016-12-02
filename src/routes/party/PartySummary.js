/* @flow */
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from '../../components/Grid';
import SummaryTable from '../../components/SummaryTable';
import s from './Party.scss';
import type { PartyType } from './';

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
