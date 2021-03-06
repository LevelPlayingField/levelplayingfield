/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import { Container, Row, Col } from '../../components/Grid';
import Link from '../../components/Link';
import s from './Party.scss';
import PartyDetails from './PartyDetails';
import PartySummary from './PartySummary';

import type { PartyType } from './';

function Party({ party }: { party: PartyType }) {
  return (
    <Layout>
      <Helmet
        title={`${party.name} - Level Playing Field`}
        meta={[{ name: 'description', content: `${party.type} - ${party.name} on Level Playing Field` }]}
        style={[{ type: 'text/css', cssText: s._getCss() }]}
      />
      <Container>
        <Row>
          <Col>
            <h1 className={s.title}>
              <Link to={`/search?q=${encodeURIComponent(`is:case party:${JSON.stringify(party.name)}`)}`}>
                {party.name}
              </Link>
              <small className={s.titleMuted}>{party.type}</small>
            </h1>

          </Col>
        </Row>
        <Row>
          <Col>
            <PartySummary party={party}/>
          </Col>
          <Col>
            <PartyDetails party={party}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Party;
