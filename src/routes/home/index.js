/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import graphql from '../../core/graphql';

export default {

  path: '/',

  async action() {
    const { summary } = await graphql(`
      {
        summary: Summary {
          cases
          parties
        }
      }
    `);

    return {
      title: 'LevelPlayingField',
      component: <Home cases={summary.cases} parties={summary.parties}/>,
    };
  },

};
