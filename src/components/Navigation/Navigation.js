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
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import Link from '../Link';

function Navigation({ className }: any) {
  return (
    <div className={cx(s.root, className)} role="navigation">
      <a
        className={s.link}
        href="https://lpf.dntly.com/#/donate"
        target="_blank"
        rel="noopener noreferrer"
      >
        Donate
      </a>
      {/* <Link className={s.link} to="/donate">Donate</Link> */}
      <Link className={s.link} to="/search?q=is:case">Cases</Link>
      <Link className={s.link} to="/search?q=is:party">Parties</Link>
    </div>
  );
}

export default withStyles(s)(Navigation);
