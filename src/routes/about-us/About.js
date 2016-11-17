/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './About.scss';

function About() {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>About Us</h1>
          <p className={s.marketing}>
            ABOUT TEXT HERE
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default withStyles(s)(About);
