/* @flow */

import React from 'react';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';

const Donate = () => {
  return (
    <Layout>
      <Container>
        <Row centerSm centerMd centerLg>
          <Col lg={4} md={6}>
            <script
              src="https://cdn.donately.com/dntly-core/1.4/core.min.js"
              data-donately-id="act_3878c1164e0f"
              data-donately-campaign-id="4083"
              data-donately-comment="true"
              data-donately-onbehalf="true"
              data-stripe-publishable-key="pk_live_1LAXoWjr4ptvmoWuqd9vvgaw"
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Donate;
