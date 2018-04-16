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

  return <div>
    <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>

    <Row className={s.rowMargin}>
      <Col className={s.alignCenter}>
        {party.aggregate_data.types && (
          <SummaryTable
            className={s.marginAuto}
            data={party.aggregate_data.types} heading="Dispute Types" headingQuery="type"
            extraTerms={{ party: party.name }}
          />
        )}
      </Col>
    </Row>

    <Row className={s.rowMargin}>
      <Col className={s.alignCenter}>
        {party.aggregate_data.dispositions && (
          <SummaryTable
            className={s.marginAuto}
            data={party.aggregate_data.dispositions} heading="Dispositions"
            headingQuery="disposition"
            extraTerms={{ party: party.name }}
          />
        )}
      </Col>
    </Row>

    <Row className={s.rowMargin}>
      <Col className={s.alignCenter}>
        {party.aggregate_data.awards && (
          <SummaryTable
            className={s.marginAuto}
            data={party.aggregate_data.awards} heading="Awards" headingQuery="awarded"
            extraTerms={{ party: party.name, disposition: 'awarded' }}
          />
        )}
      </Col>
    </Row>
  </div>;
};

export default PartySummary;
