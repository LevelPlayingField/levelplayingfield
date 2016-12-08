/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from '../layout.scss';
import content from './About.md';

function About() {
  return (
    <Layout>
      <Helmet
        title="About Us - Level Playing Field"
        meta={[{
          name: 'description',
          content: "About the team of Level Playing Field. Get to know Daniel and Frank and why we're doing this",
        }]}
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

export default About;
