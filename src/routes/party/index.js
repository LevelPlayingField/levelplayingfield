/* @flow */

import React from 'react';
import Party from './Party';
import graphql from '../../core/graphql';
import { page } from '../../components/Pager';

type PageInfo = {
  hasNextPage: bool,
  hasPreviousPage: bool,
  startCursor: string,
  endCursor: string,
};
type PartyFields = {
  id: number,
  slug: string,
  type: string,
  name: string,
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
  Cases: {
    pageInfo: PageInfo,
    edges: Array<{
      cursor: string,
      node: CaseType,
    }>,
  },
  FirmCases: {
    pageInfo: PageInfo,
    edges: Array<{
      cursor: string,
      node: CaseType,
    }>,
  },
  Attorneys: { edges: Array<{node: PartyFields}>},
  Firms: { edges: Array<{node: PartyFields}>},
};

export default {

  path: '/party/:slug',

  async action({ params, query }: any) {
    const data = await graphql(`
fragment pageInfo on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}

fragment PartyFields on Party {
  id
  slug
  type
  name
}

fragment CasePartyFields on CaseParty {
  case_id
  Case {
    case_number
    initiating_party
    Parties {
      edges {
        node {
          type
          party_name
        }
      }
    }
  }
}

{
  party: Party(slug: "${params.slug}") {
    ...PartyFields
    Cases(${page('Case')(query, 5)}) {
      pageInfo {
          ...pageInfo
      }
      edges {
        cursor
        node {
          ...CasePartyFields
        }
      }
    }
    FirmCases(${page('Case')(query, 5)}) {
      pageInfo {
          ...pageInfo
      }      
      edges {
        cursor
        node {
          ...CasePartyFields
        }
      }
    }
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
      title: 'Party',
      component: <Party party={data.party}/>,
    };
  },

};
