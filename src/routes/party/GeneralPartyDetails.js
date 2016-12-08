/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { Row, Col } from '../../components/Grid';
import s from './Party.scss';

function GeneralPartyDetails() {
  return (
    <Row>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Col md={6} lg={6}/>
    </Row>
  );
}

export default GeneralPartyDetails;
