import React from 'react';
import Search from '../../data/containers/Search';
import Component from './Search';

export default {
  path: '/search',
  async action() {
    return {
      title: 'Search',
      component: <Search Component={Component}/>,
    };
  },
};
