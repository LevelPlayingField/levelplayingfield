/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./home').default,
    require('./privacy').default,
    require('./about-us').default,
    require('./donate').default,

    require('./search').default,

    require('./case').default,
    require('./party').default,

    require('./notFound').default,
  ],

  async action({ next }: any) {
    return await next();
  },
};
