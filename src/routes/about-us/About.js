/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from '../layout.scss';
import content from './About.md';

function About() {
  return (
    <Layout>
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

export default withStyles(s)(About);
