/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { Row, Col } from '../../components/Grid';
import s from './Party.scss';
import PartyItem from './PartyItem';

import type { PartyType } from './';

function AttorneyDetails({ party }: { party: PartyType }) {
  return (
    <div>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <h4 className={s.subtitle}>Law Firms</h4>

      <ul className={s.parties}>
        {party.Firms.edges.map(firm => (
          <PartyItem party={firm} key={`firm_${firm.node.id}`}/>
        ))}
      </ul>
    </div>
  );
}

export default AttorneyDetails;
