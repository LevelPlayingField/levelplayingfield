/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { Row, Col } from '../../components/Grid';
import s from './Party.scss';
import PartyItem from './PartyItem';
import type { PartyType } from './';

function LawFirmDetails({ party }: {party: PartyType}) {
  return (
    <Row>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Col md={6} lg={6}>
        <h4 className={s.subtitle}>Attorneys</h4>

        <ul className={s.parties}>
          {party.Attorneys.edges.map(attorney =>
            <PartyItem party={attorney} key={`attorney_${attorney.node.id}`}/>
          )}
        </ul>
      </Col>
    </Row>
  );
}

export default LawFirmDetails;
