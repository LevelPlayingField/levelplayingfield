/* @flow */

import React from 'react';
import Donate from './Donate';

export default {
  path: '/donate',
  action() {
    return {
      component: <Donate/>,
    };
  },
};
