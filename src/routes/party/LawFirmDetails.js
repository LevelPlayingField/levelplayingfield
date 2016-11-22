/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Party.scss';
import CaseItem from './CaseItem';
import PartyItem from './PartyItem';
import type { PartyType } from './';

function LawFirmDetails({ party }: {party: PartyType}) {
  return (
    <div className={s.row}>
      <div className={s.col_half}>
        <h4 className={s.subtitle}>Attorneys</h4>

        <ul className={s.parties}>
          {party.Attorneys.edges.map(attorney =>
            <PartyItem party={attorney} key={`attorney_${attorney.node.id}`}/>
          )}
        </ul>
      </div>
      <div className={s.col_half}>
        <h4 className={s.subtitle}>Known Cases</h4>

        <ul className={s.cases}>
          {party.FirmCases.edges.map(case_ =>
            <CaseItem party={party} case_={case_} key={`case_${case_.node.case_id}`}/>
          )}
        </ul>
      </div>
    </div>
  );
}

export default withStyles(s)(LawFirmDetails);
