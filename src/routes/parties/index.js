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
import Parties from './Parties';
import graphql from '../../core/graphql';

export default {

  path: '/parties',

  async action() {
    const data = await graphql(`{
  parties: Parties(limit: 20) {
    id
    slug
    type
    name
    Cases {
      total
    }
    FirmCases {
      total
    }
  }
}`);

    if (!data || !data.parties) throw new Error('Failed to load parties.');

    return {
      title: 'Parties',
      component: <Parties parties={data.parties} />,
    };
  },

};
