/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Party from './Party';
import graphql from '../../core/graphql';
import { page } from '../../components/Pager';

export default {

  path: '/party/:slug',

  async action({ params, query }) {
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
          party_type
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
