/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './About.scss';
import content from './About.md';

function About() {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container} dangerouslySetInnerHTML={{ __html: content }}/>
      </div>
    </Layout>
  );
}

export default withStyles(s)(About);
