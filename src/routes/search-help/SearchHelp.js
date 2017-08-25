/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import s from '../layout.scss';
import content from './SearchHelp.md';

function SearchHelp() {
  return (
    <Layout>
      <Helmet
        title="How to Search - Level Playing Field"
        meta={[{
          name: 'description',
          content: 'A bit of help and advice on how to use the Level Playing Field search engine',
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

export default SearchHelp;
