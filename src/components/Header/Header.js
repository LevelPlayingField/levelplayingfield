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
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import SearchBar from '../SearchBar';


function Header() {
  return (
    <div className={s.root}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <div className={s.container}>
        <div className={s.sections}>
          <Link className={s.brand} to="/">
            <span className={s.brandTxt}>Level Playing Field</span>
          </Link>
          <SearchBar className={s.search}/>
          <Navigation className={s.nav}/>
        </div>
      </div>
    </div>
  );
}

export default Header;
