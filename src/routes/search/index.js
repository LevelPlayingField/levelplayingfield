/* @flow */

import React from 'react';
import Container from './Container';
import Search from './Search';
import graphql from '../../core/graphql';

type ActionParams = {
  params: {
    term?: string,
  },
  query: {
    q?: string,
    page?: number,
    perPage?: number,
  },
};

export default {
  path: '/search',

  async action(args: ActionParams) {
    const { query: { q = '', page = 1, perPage = 20 } } = args;
    const { Search: { Results } } = await graphql(`
    {
      Search(query: ${JSON.stringify(q)}) {
        Results(page: ${page}, perPage: ${perPage}) {
          page
          pages
          total
          
          edges {
            node {
              id
              type
              slug
              document
            }
          }
        }
      }
    }
    `);

    return {
      title: 'Search',
      component: (
        <Container
          Component={Search}
          results={Results.edges.map(e => e.node)}
          page={Results.page}
          pages={Results.pages}
          perPage={perPage}
          query={q}
        />
      ),
    };
  },
};
