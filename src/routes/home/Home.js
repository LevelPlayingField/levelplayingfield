/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import cx from 'classnames';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import SummaryTable from '../../components/SummaryTable';
import s from './Home.scss';
import content from './Home.md';

type Props = { awards: any, dispositions: any, dispute_types: any };

function Home({ awards, dispositions, dispute_types }: Props) {
  return (
    <Layout>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Container>
        <Row>
          <Col lg={8} className={s.marginAuto}>
            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            {dispute_types ? (
              <SummaryTable
                className={cx(s.marginAuto, s.tableColumns)}
                heading="Dispute Types by Closing Date" headingQuery="type"
                data={dispute_types}
              />
            ) : null}
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            {dispositions ? (
              <SummaryTable
                className={cx(s.marginAuto, s.tableColumns)}
                heading="Case Dispositions by Closing Date" headingQuery="disposition"
                data={dispositions}
              />
            ) : null}
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            {awards &&
            <SummaryTable
              className={cx(s.marginAuto, s.tableColumns)}
              heading="Awarded Parties by Closing Date" headingQuery="awarded"
              data={awards} extraTerms={{ disposition: 'awarded' }}
            />
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Home;
