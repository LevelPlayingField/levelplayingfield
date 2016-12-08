/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from './Privacy.scss';
import content from './Privacy.md';

function Privacy() {
  return (
    <Layout>
      <Helmet
        title="Privacy Policy"
        meta={[{ name: 'description', content: 'Privacy Policy and Terms of Use' }]}
        style={[{ type: 'text/css', cssText: s._getCss() }]}
      />
      <Container>
        <Row>
          <Col>
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Privacy;
