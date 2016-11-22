/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Pager from '../../components/Pager';
import s from './Party.scss';
import CaseItem from './CaseItem';
import PartyItem from './PartyItem';

import type { PartyType } from './';


function AttorneyDetails({ party }: {party: PartyType }) {
  return (
    <div className={s.row}>
      <div className={s.col_half}>
        <h4 className={s.subtitle}>Law Firms</h4>

        <ul className={s.parties}>
          {party.Firms.edges.map(firm => (
            <PartyItem party={firm} key={`firm_${firm.node.id}`}/>
          ))}
        </ul>
      </div>
      <div className={s.col_half}>
        <h4 className={s.subtitle}>Known Cases</h4>

        <ul className={s.cases}>
          {party.Cases.edges.map(case_ =>
            <CaseItem party={party} case_={case_} key={`case_${case_.node.case_id}`}/>
          )}
        </ul>
        <Pager queryKey={'Case'} pageInfo={party.Cases.pageInfo}/>
      </div>
    </div>
  );
}

export default withStyles(s)(AttorneyDetails);
