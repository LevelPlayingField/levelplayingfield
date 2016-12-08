/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Link from '../../components/Link';
import s from './Party.scss';
import type { PartyType } from './';

function PartyItem({ party }: { party: { node: PartyType }}) {
  return (
    <li className={s.partyItem}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <Link to={`/party/${party.node.slug}`}>
        {party.node.type} - {party.node.name}
      </Link>
    </li>
  );
}

export default PartyItem;
