/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import SummaryTable from '../../components/SummaryTable';
import s from './Home.scss';
import content from './Home.md';

function Home({ awards, dispositions }: { awards: any, dispositions: any }) {
  return (
    <Layout>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Container>
        <Row>
          <Col>
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col md={12} centerMd lg={6}>
            {dispositions &&
            <SummaryTable heading="Case Dispositions by Closing Date" headingQuery="disposition" data={dispositions}/>
            }
          </Col>
          <Col md={12} centerMd lg={6}>
            {awards &&
            <SummaryTable
              heading="Awarded Parties by Closing Date" headingQuery="awarded" data={awards}
              extraTerms={{ disposition: 'awarded' }}
            />
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Home;
