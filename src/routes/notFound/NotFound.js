/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';
import s from './NotFound.scss';

function NotFound() {
  return (
    <Layout full={false}>
      <Helmet title="Page Not Found" style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <div className={s.root}>
        <div className={s.container}>
          <h1>Page Not Found</h1>
          <p>Sorry, the page you were trying to view does not exist.</p>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
