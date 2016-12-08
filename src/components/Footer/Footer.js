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
import {
  IoEmail as Email,
  IoSocialFacebook as Facebook,
  IoSocialTwitter as Twitter,
} from 'react-icons/lib/io';
import Helmet from 'react-helmet';
import s from './Footer.scss';
import Link from '../Link';

const ICON_SIZE = 20;
function Footer() {
  return (
    <div className={s.root}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <div className={s.container}>
        <span className={s.text}>© Level Playing Field</span>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">Home</Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/about-us">About Us</Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">Privacy</Link>
        <span className={s.spacer}>·</span>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:team@lpf.io?subject=Hello, LPF!"
        >
          <Email size={ICON_SIZE}/>
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/lpf_dot_io"
        >
          <Twitter size={ICON_SIZE}/>
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/levelplayingfieldio/"
        >
          <Facebook size={ICON_SIZE}/>
        </a>
      </div>
    </div>
  );
}

export default Footer;
