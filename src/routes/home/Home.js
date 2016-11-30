/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from './Home.scss';
import content from './Home.md';

function Home() {
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

export default withStyles(s)(Home);
