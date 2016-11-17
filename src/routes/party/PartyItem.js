import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Party.scss';

function PartyItem({ party }) {
  return (
    <li className={s.partyItem}>
      <Link to={`/party/${party.node.slug}`}>
        {party.node.type} - {party.node.name}
      </Link>
    </li>
  );
}

PartyItem.propTypes = {
  party: PropTypes.any.isRequired,
};

export default withStyles(s)(PartyItem);
