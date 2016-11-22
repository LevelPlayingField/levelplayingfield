/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Party.scss';
import first from '../../core/first';

import type { CaseType } from './';

const consumerParty = { type: 'Consumer', party_name: 'Consumer' };

function CaseItem({ case_ }: { case_: {node: CaseType} }) {
  const nonConsumer = first(
    case_.node.Case.Parties.edges
      .map(edge => edge.node)
      .filter(other => other.type === 'Non Consumer')
  );

  let caseString;

  switch (case_.node.Case.initiating_party) {
    case 'Consumer':
      caseString = `${consumerParty.party_name} vs. ${nonConsumer.party_name}`;
      break;
    case 'Non Consumer':
      caseString = `${nonConsumer.party_name} vs. ${consumerParty.party_name}`;
      break;
    default:
      caseString = nonConsumer.party_name;
  }

  return (
    <li className={s.caseItem}>
      <Link to={`/case/${case_.node.case_id}`} className={s.caseNumber}>
        Case Number {case_.node.Case.case_number}
      </Link>
      <div>{caseString}</div>
    </li>
  );
}

export default withStyles(s)(CaseItem);
