/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import MoneyCents from '../../components/MoneyCents';
import { partyType, CONSUMER, NON_CONSUMER } from './utils';
import s from './Case.scss';


function AwardsTable({ case_ }: { case_: {[key: any]: any}}) {
  const initiatedBy = partyType(case_.initiating_party);
  const plaintiff = initiatedBy === NON_CONSUMER ? 'business' : 'consumer';
  const defendant = initiatedBy === CONSUMER ? 'business' : 'consumer';

  return (
    <table className={s.table}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <tbody>
        <tr>
          <th>Claims & Awards</th>
          <th>{initiatedBy !== null ? 'Plaintiff' : 'Unknown'}</th>
          <th>{initiatedBy !== null ? 'Defendant' : ''}</th>
        </tr>
        <tr>
          <td>Claim Amount</td>
          <td><MoneyCents value={case_[`claim_amount_${plaintiff}`]}/></td>
          <td><MoneyCents value={case_[`claim_amount_${defendant}`]}/></td>
        </tr>
        <tr>
          <td>Arbitration Fee</td>
          <td><MoneyCents value={case_[`fees_${plaintiff}`]}/></td>
          <td><MoneyCents value={case_[`fees_${defendant}`]}/></td>
        </tr>
        <tr>
          <td>Award Amount</td>
          <td><MoneyCents value={case_[`award_amount_${plaintiff}`]}/></td>
          <td><MoneyCents value={case_[`award_amount_${defendant}`]}/></td>
        </tr>
        <tr>
          <td>Attorney&apos;s Fees</td>
          <td><MoneyCents value={case_[`attorney_fees_${plaintiff}`]}/></td>
          <td><MoneyCents value={case_[`attorney_fees_${defendant}`]}/></td>
        </tr>
        <tr>
          <td>Total</td>
          <td/>
          <td/>
        </tr>
        <tr>
          <td>Other Relief</td>
          <td>{case_[`o3ther_relief_${plaintiff}`]}</td>
          <td>{case_[`other_relief_${defendant}`]}</td>
        </tr>
      </tbody>
    </table>
  );
}
AwardsTable.propTypes = {
  case_: PropTypes.any.isRequired,
};

export default AwardsTable;
