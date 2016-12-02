/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import SummaryTable from '../../components/SummaryTable';
import s from './Home.scss';
import content from './Home.md';

function Home({ awards, dispositions }) {
  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={6}>
            <SummaryTable heading="Case Dispositions" data={dispositions}/>
          </Col>
          <Col md={6} lg={6}>
            <SummaryTable heading="Awarded Parties" data={awards}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default withStyles(s)(Home);
