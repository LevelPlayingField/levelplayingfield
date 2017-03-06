/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from '../layout.scss';
import content from './DonateThanks.md';

function DonateThanks() {
  return (
    <Layout>
      <Helmet
        title="About Us - Level Playing Field"
        meta={[{
          name: 'description',
          content: "Thanks for donating!",
        }]}
        style={[{ type: 'text/css', cssText: s._getCss() }]}
      />
      <Container>
        <Row centerLg centerMd>
          <Col lg={6} md={8}>
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default DonateThanks;
