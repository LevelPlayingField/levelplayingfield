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
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';

function Layout({ children }: any) {
  return (
    <div>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
