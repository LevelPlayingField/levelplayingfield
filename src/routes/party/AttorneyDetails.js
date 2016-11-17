import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Pager from '../../components/Pager';
import s from './Party.scss';
import CaseItem from './CaseItem';
import PartyItem from './PartyItem';

function AttorneyDetails({ party }) {
  return (
    <div className={s.row}>
      <div className={s.col_half}>
        <h4 className={s.subtitle}>Law Firms</h4>

        <ul className={s.parties}>
          {party.Firms.edges.map(firm => (
            <PartyItem party={firm} key={`firm_${firm.node.party_id}`}/>
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

AttorneyDetails.propTypes = {
  party: PropTypes.any.isRequired,
};

export default withStyles(s)(AttorneyDetails);
