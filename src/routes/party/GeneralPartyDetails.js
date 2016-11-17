import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Party.scss';
import CaseItem from './CaseItem';
import Debug from '../../components/Debug';

function GeneralPartyDetails({ party }) {
  return (
    <div className={s.row}>

      <div className={s.col_half}>
        <h4 className={s.subtitle}>Known Cases</h4>

        <ul className={s.cases}>
          {party.Cases.edges.map(case_ =>
            <CaseItem party={party} case_={case_} key={`case_${case_.node.case_id}`}/>
          )}
        </ul>
        <ul className={s.pagination}>
          {party.Cases.pageInfo.hasPreviousPage && <li className={s.prev}>&lt;</li>}
          {party.Cases.pageInfo.hasNextPage && <li className={s.next}>&gt;</li>}
        </ul>
      </div>
      <div className={s.col_half}>
        <Debug>
          <pre>{JSON.stringify(party, null, 2)}</pre>
        </Debug>
      </div>
    </div>
  );
}

GeneralPartyDetails.propTypes = {
  party: PropTypes.any.isRequired,
};

export default withStyles(s)(GeneralPartyDetails);
