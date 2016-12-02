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
import Twitter from 'react-icons/lib/io/social-twitter';
import s from './Footer.scss';
import Link from '../Link';

function Footer() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <span className={s.text}>© LevelPlayingField.io | lpf.io</span>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">Home</Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/about-us">About Us</Link>
        <span className={s.spacer}>·</span>
        <a
          className={s.link}
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:contact@lpf.io?subject=Hello, LPF!"
        >
          Contact Us
        </a>
        <span className={s.spacer}>·</span>
        <a
          className={s.link}
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/lpf_dot_io"
        >
          <Twitter/>
          lpf_dot_io
        </a>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">Privacy</Link>
      </div>
    </div>
  );
}

export default withStyles(s)(Footer);
