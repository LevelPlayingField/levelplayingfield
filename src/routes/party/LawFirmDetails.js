/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from '../../components/Grid';
import s from './Party.scss';
import PartyItem from './PartyItem';
import type { PartyType } from './';

function LawFirmDetails({ party }: {party: PartyType}) {
  return (
    <Row>
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

export default withStyles(s)(LawFirmDetails);
