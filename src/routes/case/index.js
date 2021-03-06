/* @flow */
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

  async action({ params }: any) {
    const data = await graphql(`
    fragment PartyFields on Party {
      id
      slug
      type
      name
    }
    
    {
      case: Case(case_id: ${params.caseID}) {
        id
        case_id
        import_date
        case_number
        arbitration_board
        initiating_party
        source_of_authority
        dispute_type
        dispute_subtype
        salary_range
        prevailing_party
        filing_date
        close_date
        type_of_disposition
        claim_amount_business
        fee_allocation_business
        fees_business
        award_amount_business
        attorney_fees_business
        other_relief_business
        claim_amount_consumer
        fee_allocation_consumer
        fees_consumer
        award_amount_consumer
        attorney_fees_consumer
        other_relief_consumer
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
        arb_or_cca_count
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

    if (!data || !data.case) throw new Error('Failed to load case.');

    return {
      title: 'Case',
      component: <Case case_={data.case} />,
    };
  },
};
