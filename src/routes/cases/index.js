/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Cases from './Cases';
import graphql from '../../core/graphql';

export default {

  path: '/cases',

  async action() {
    const resp = await graphql(`{
  cases: Cases(limit: 20){
    id
    case_number
    initiating_party
    
    Parties {
      edges {
        node {
          party_type
          party_name
        }
      }
    }
  }
}`);

    const { data } = await resp.json();

    if (!data || !data.cases) throw new Error('Failed to load cases.');

    return {
      title: 'Cases',
      component: <Cases cases={data.cases}/>,
    };
  },

};
