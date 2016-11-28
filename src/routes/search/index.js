/* @flow */

import React from 'react';
import Search from '../../data/containers/Search';
import Component from './Search';

async function action({ params: { term } } : { params: { term: ?string }}) {
  return {
    title: 'Search',
    component: <Search Component={Component} term={term}/>,
  };
}

export default {
  path: '/search/:term*',

  action,
};
