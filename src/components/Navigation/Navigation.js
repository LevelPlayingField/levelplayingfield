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
import Helmet from 'react-helmet';
import s from './Navigation.scss';
import Link from '../Link';

function Navigation({ className }: any) {
  return (
    <div className={cx(s.root, className)} role="navigation">
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <a
        className={s.link}
        href="https://www.patreon.com/levelplayingfield"
        target="_blank"
        rel="noopener noreferrer"
      >
        Donate
      </a>
      
      <a
        className={s.link}
        href="https://forum.levelplayingfield.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        Forum
      </a>
      
      <a
        className={s.link}
        href="https://blog.levelplayingfield.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        Blog
      </a>

      <Link className={s.link} to="/search?q=is:case">Cases</Link>
      {/*<Link className={s.link} to="/search?q=is:party">Parties</Link>*/}
    </div>
  );
}

export default Navigation;
