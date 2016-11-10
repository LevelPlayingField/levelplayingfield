/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/md/search';
import s from './Search.css';

function Search({ className }) {
  return (
    <div className={cx(className, s.root)}>
      <div className={s.container}>
        <MDSearch className={s.searchIcon}/>
        <input className={s.searchInput} type="text"/>
      </div>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Search);
