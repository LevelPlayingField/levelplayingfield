/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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
      <Container>
        <Row>
          <Col>
            <h1 className={s.title}>
              <Link to={`/search/is:case%20party:${JSON.stringify(party.name)}`}>
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
        </Row>
        <Row>
          <Col>
            <PartyDetails party={party}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default withStyles(s)(Party);
