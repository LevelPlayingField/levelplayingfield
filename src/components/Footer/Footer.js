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
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/fontawesome-free-solid';
import { faTwitter, faFacebook, faPatreon } from '@fortawesome/fontawesome-free-brands';
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
          className={s.link}
          href="https://forum.levelplayingfield.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Forum
        </a>
        <span className={s.spacer}>·</span>        
        <a
          className={s.link}
          href="https://blog.levelplayingfield.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog
        </a>
        <span className={s.spacer}>·</span>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:team@lpf.io?subject=Hello, LPF!"
        >
          <FontAwesomeIcon icon={faEnvelope} size='lg'/>
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/lpf_dot_io"
        >
          <FontAwesomeIcon icon={faTwitter} size='lg'/>
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/levelplayingfieldio/"
        >
          <FontAwesomeIcon icon={faFacebook} size='lg'/>
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.patreon.com/levelplayingfield"
        >
          <FontAwesomeIcon icon={faPatreon} size='lg'/>
        </a>
      </div>
    </div>
  );
}

export default Footer;
