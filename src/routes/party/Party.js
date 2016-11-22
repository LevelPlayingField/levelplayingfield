/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Party.scss';
import PartyDetails from './PartyDetails';

import type { PartyType } from './';

function Party({ party }: { party: PartyType }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>
            {party.name}
            <small className={s.titleMuted}>{party.type}</small>
          </h1>

          <PartyDetails party={party}/>
        </div>
      </div>
    </Layout>
  );
}

export default withStyles(s)(Party);
