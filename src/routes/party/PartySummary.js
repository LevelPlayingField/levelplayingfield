/* @flow */
import React from 'react';
import Helmet from 'react-helmet';
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
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
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

export default PartySummary;
