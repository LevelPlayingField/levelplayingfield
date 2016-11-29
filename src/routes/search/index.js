/* @flow */

import React from 'react';
import SearchContainer from '../../data/containers/Search';
import Component from './Search';

type ActionParams = {
  params: {
    term: ?string,
  },
  query: {
    page: ?number,
  },
};

export default {
  path: '/search/:term*',

  action(args: ActionParams) {
    const { params: { term }, query: { page } } = args;

    return {
      title: 'Search',
      component: <SearchContainer Component={Component} term={term} page={page}/>,
    };
  }
};
