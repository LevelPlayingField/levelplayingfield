/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Party.scss';
import type { PartyType } from './';

function PartyItem({ party }: { party: { node: PartyType }}) {
  return (
    <li className={s.partyItem}>
      <Link to={`/party/${party.node.slug}`}>
        {party.node.type} - {party.node.name}
      </Link>
    </li>
  );
}

export default withStyles(s)(PartyItem);
