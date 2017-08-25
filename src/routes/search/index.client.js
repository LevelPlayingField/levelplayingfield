/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Container from './Container';
import Search from './Search';

import { RESULTS_KEY } from './constants';
import type { ActionParams } from './Types';

export default {
  path: '/search',

  async action(args: ActionParams) {
    const { query: { q = '', page = 1, perPage = 20, sortBy = '', sortDir = 'ASC' } } = args;
    const initialResults = window[RESULTS_KEY];

    delete window[RESULTS_KEY];

    return {
      component: (
        <div>
          <Helmet/>
          <Container
            Component={Search}
            perPage={perPage}
            page={initialResults ? initialResults.page : page}
            pages={initialResults && initialResults.pages}
            results={initialResults && initialResults.edges.map(e => e.node)}
            serverRendered={initialResults != null}
            sortBy={sortBy}
            sortDir={sortDir}
            query={q}
            urlArgs={args.query}
          />
        </div>
      ),
    };
  },
};
