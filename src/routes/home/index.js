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
import Home from './Home';
import graphql from '../../core/graphql';

export default {

  path: '/',

  async action() {
    const { awards, dispositions } = await graphql(`{
      awards: Summary(name: "case_awards") {
        data
      }
      dispositions: Summary(name: "case_dispositions") {
        data
      }
    }`);

    return {
      component: <Home awards={awards.data} dispositions={dispositions.data}/>,
    };
  },

};
