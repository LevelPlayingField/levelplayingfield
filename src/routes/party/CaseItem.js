import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Party.css';
import first from '../../core/first';

const Consumer = { party_type: 'Consumer', party_name: 'Consumer' };

function CaseItem({ party, case_ }) {
  const consumer = party.type === 'Non Consumer' ? Consumer : { party_type: party.type, party_name: party.name };
  const nonConsumer = first(
          case_.node.Case.Parties.edges
            .map(edge => edge.node)
            .filter(other => other.party_type === 'Non Consumer')
        );

  let caseString;

  switch (case_.node.Case.initiating_party) {
    case 'Consumer':
      caseString = `${consumer.party_name} vs. ${nonConsumer.party_name}`;
      break;
    case 'Non Consumer':
      caseString = `${nonConsumer.party_name} vs. ${consumer.party_name}`;
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

CaseItem.propTypes = {
  party: PropTypes.any.isRequired,
  case_: PropTypes.any.isRequired,
};

export default withStyles(s)(CaseItem);
