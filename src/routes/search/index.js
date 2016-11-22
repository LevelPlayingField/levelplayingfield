/* @flow */

import React from 'react';
import Search from '../../data/containers/Search';
import Component from './Search';

function action({ params } : { params: { term: ?string }}) {
  return {
    title: 'Search',
    component: <Search Component={Component} term={params.term}/>,
  };
}

export default {
  path: '/search/:term*',

  action,
};
