/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import s from './Parties.css';

function Parties({ parties }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>Parties</h1>
          <ul className={s.parties}>
            {parties.map(party => (
              <li className={s.partiesItem} key={`party_${party.slug}`}>
                <Link className={s.partiesTitle} to={`/party/${party.slug}`}>
                  {party.type}
                  <span className={s.seperator}>-</span>
                  {party.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

Parties.propTypes = {
  parties: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default withStyles(s)(Parties);
