/* @flow */

import React from 'react';
import Party from './Party';
import graphql from '../../core/graphql';

type PartyFields = {
  id: number,
  slug: string,
  type: string,
  name: string,
  aggregate_data: {
    awards: {
      [key: string]: {
        [key: string]: number,
      },
    },
    dispositions: {
      [key: string]: {
        [key: string]: number,
      }
    }
  }
}
export type CaseType = {
  case_id: number,
  Case: {
    case_number: string,
    initiating_party: string,

    Parties: {
      edges: Array<{
        node: {
          type: string,
          party_name: string,
        }
      }>
    }
  }
}
export type PartyType = PartyFields & {
  Attorneys: { edges: Array<{node: PartyFields}>},
  Firms: { edges: Array<{node: PartyFields}>},
};

export default {

  path: '/party/:slug',

  async action({ params }: any) {
    const data = await graphql(`
fragment PartyFields on Party {
  id
  slug
  type
  name
  aggregate_data
}

{
  party: Party(slug: "${params.slug}") {
    ...PartyFields
    Firms {
      edges {
        node {
          ...PartyFields
        }
      }
    }
    Attorneys {
      edges {
        node {
          ...PartyFields
        }
      }
    }
  }
}
`);

    if (!data || !data.party) throw new Error('Failed to load party.');

    return {
      component: <Party party={data.party}/>,
    };
  },

};
