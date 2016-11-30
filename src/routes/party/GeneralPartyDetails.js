/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from '../../components/Grid';
import s from './Party.scss';

function GeneralPartyDetails() {
  return (
    <Row>
      <Col md={6} lg={6}/>
    </Row>
  );
}

export default withStyles(s)(GeneralPartyDetails);
