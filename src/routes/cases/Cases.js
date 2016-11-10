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
import s from './Cases.css';
import first from '../../core/first';

function Cases({ cases }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>Cases</h1>
          <ul className={s.cases}>
            {cases.map(case_ => {
              const nonConsumer = first(
                case_.Parties.edges.filter(party => party.node.party_type === 'Non Consumer')
              );

              return (
                <li className={s.casesItem}>
                  <Link className={s.casesTitle} to={`/case/${case_.id}`}>
                    Case Number {case_.case_number}
                  </Link>
                  <span className={s.casesDesc}>
                    {case_.initiating_party === 'Consumer'
                      ? `${case_.initiating_party} vs. ${nonConsumer.node.party_name}`
                      : `${nonConsumer.node.party_name} vs. Consumer`
                    }
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

Cases.propTypes = {
  cases: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default withStyles(s)(Cases);
