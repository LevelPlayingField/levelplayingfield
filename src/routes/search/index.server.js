/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Container from './Container';
import Search from './Search';
import graphql from '../../core/graphql';
import SearchQuery from './SearchQuery.graphql';
import { RESULTS_KEY } from './constants';

import type { ActionParams } from './Types';

export default {
  path: '/search',

  async action(args: ActionParams) {
    const { query: { q = '', page = 1, perPage = 20, sortBy = 'close_date', sortDir = 'DESC' } } = args;
    const { Search: { Results } } = await graphql(SearchQuery, {
      query: q,
      perPage,
      page,
      sortBy,
      sortDir,
    });

    return {
      component: (
        <div>
          <Helmet
            script={[
              {
                innerHTML: `window.${RESULTS_KEY} = ${JSON.stringify(Results)};`,
              },
            ]}
          />
          <Container
            serverRendered
            Component={Search}
            results={Results.edges.map(e => e.node)}
            page={Results.page}
            pages={Results.pages}
            perPage={perPage}
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
