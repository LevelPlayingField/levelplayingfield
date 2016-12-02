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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

function Header() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.sections}>
          <Link className={s.brand} to="/">
            <span className={s.brandTxt}>lpf.io</span>
          </Link>
          <Navigation className={s.nav}/>
        </div>
        <div className={s.banner}>
          <h1 className={s.bannerTitle}>Level Playing Field</h1>
          {/*
            <p className={s.bannerDesc}>Leveling the playing field for consumer arbitration</p>
          */}
        </div>
      </div>
    </div>
  );
}

export default withStyles(s)(Header);
