/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Case from './Case';
import graphql from '../../core/graphql';

export default {

  path: '/case/:caseID',

  async action({ params }) {
    const resp = await graphql(`
    fragment PartyFields on Party {
      id
      slug
      type
      name
    }
    
    {
      case: Case(id: ${params.caseID}) {
        id
        case_number
        initiating_party
        source_of_authority
        dispute_type
        dispute_subtype
        salary_range
        prevailing_party
        filing_date
        close_date
        type_of_disposition
        business_fees
        consumer_fees
        fee_allocation_consumer
        fee_allocation_business
        award_amount_consumer
        award_amount_business
        other_relief_consumer
        other_relief_business
        attorney_fees_consumer
        attorney_fees_business
        consumer_rep_state
        consumer_self_represented
        document_only_proceeding
        type_of_hearing
        hearing_addr1
        hearing_addr2
        hearing_city
        hearing_state
        hearing_zip
        arb_count
        med_count
        consumer_arb_count
        adr_process
        
        Parties {
          edges {
            node {
              date
              fees
              Party {
                ...PartyFields
              }
              Firm {
                ...PartyFields
              }
            }
          }
        }
      }
    }
    `);

    const { data } = await resp.json();

    if (!data || !data.case) throw new Error('Failed to load case.');

    return {
      title: 'Case',
      component: <Case case_={data.case} />,
    };
  },
};
