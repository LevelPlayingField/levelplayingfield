/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Home.scss';
import content from './Home.md';

function Home() {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container} dangerouslySetInnerHTML={{ __html: content }}/>
      </div>
    </Layout>
  );
}

export default withStyles(s)(Home);
