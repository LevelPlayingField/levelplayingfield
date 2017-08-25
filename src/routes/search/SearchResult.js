/* @flow */
/* eslint-disable no-case-declarations */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Link from '../../components/Link';
import s from './Search.scss';
import { NON_CONSUMER, partyType } from '../case/utils';
import first from '../../core/first';

import type { CaseType, PartyType } from './Types';

const isEmpty = (val: ?Array<any>): bool => (val == null || val.length === 0);

type PropHasChildren = {
  children: PropTypes.element.isRequired,
};

function cell(url: string) {
  return ({ children, ...props }: PropHasChildren) => (
    <td {...props}>
      <Link className={s.cellLink} to={url} title={children}>
        {children}
      </Link>
    </td>
  );
}

function CaseResult({ url, Case }: { url: string, Case: CaseType }) {
  const C = cell(url);
  const initiatedBy = partyType(Case.initiating_party);
  const consumer = {
    party_name: 'Consumer',
    attorneys: Case.parties.filter(party => party.type === 'Attorney'),
  };
  const nonConsumer = first(
    Case.parties.filter(party => party.type === 'Non Consumer'));
  const arbitrators = Case.parties
    .filter(party => party.type === 'Arbitrator')
    .sort((a, b) => {
      const aD = new Date(a.date).getTime();
      const bD = new Date(b.date).getTime();

      if (aD > bD) {
        return -1;
      } else if (aD < bD) {
        return 1;
      }
      return 0;
    });
  const [plaintiff, defendant] = initiatedBy === NON_CONSUMER
    ? [nonConsumer, consumer]
    : [consumer, nonConsumer];

  return (
    <tbody className={s.resultRow}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <tr>
        <C className={s.cell1} title="Case #">{Case.case_number}</C>
        <C className={s.cell2} title="Plaintiff">{plaintiff.party_name}</C>
        <C className={s.cell3} title="Defendant">{defendant.party_name}</C>
        <C className={s.cell4}
           title="Arbitration Board">{Case.arbitration_board}</C>
        <C className={s.cell5}
           title="Disposition">{Case.type_of_disposition}</C>
        <C className={s.cell6} title="Filed">{new Date(
          Case.filing_date).toLocaleDateString('en-US',
          { timeZone: 'UTC' })}</C>
      </tr>
      <tr>
        <C className={s.cell1} title="Dispute Type">{Case.dispute_type}</C>
        <C className={s.cell2}
           title={isEmpty(plaintiff.attorneys) ? null : 'Plaintiff Attorneys'}>
          {plaintiff.attorneys && plaintiff.attorneys.length
            ? plaintiff.attorneys.map(p => `${p.party_name} - ${p.firm_name}`)
              .join(', ')
            : '---'}
        </C>
        <C className={s.cell3}
           title={isEmpty(defendant.attorneys) ? null : 'Defendant Attorneys'}>
          {defendant.attorneys
            ? defendant.attorneys.map(p => `${p.party_name} - ${p.firm_name}`)
              .join(', ')
            : '---'}
        </C>
        <C className={s.cell4}
           title={isEmpty(arbitrators) ? null : 'Arbitrators'}>
          {arbitrators.map(p => p.party_name).join(', ')}
        </C>
        <C className={s.cell5} title={Case.prevailing_party === '---' ? null : 'Awardee'}>
          {Case.prevailing_party}
        </C>
        <C className={s.cell6} title="Closed">
          {new Date(Case.close_date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </C>
      </tr>
    </tbody>
  );
}

function PartyResult({ url, Party }: { url: string, Party: PartyType }) {
  const C = cell(url);

  return (
    <tbody className={s.resultRow}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      <tr>
        <C title="Type">{Party.type}</C>
        <C title="Name">{Party.name}</C>
        {(() => {
          if (Party.firms) {
            return (
              <C title="Firms">
                {`${Party.firms.map(firm => firm.name).join(', ')}`}
              </C>
            );
          }
          if (Party.attorneys) {
            return (
              <C title="Attorneys">
                {`${Party.attorneys.map(attorney => attorney.name).join(', ')}`}
              </C>
            );
          }
          return <C/>;
        })()}
        <C title="Cases">
          {Party.case_count}
        </C>
      </tr>
    </tbody>
  );
}

function SearchResult({ result }: { result: Result }) {
  const doc = result.document;

  switch (result.type) {
    case 'case':
      return <CaseResult url={`/case/${result.id}`} Case={doc}/>;
    case 'party':
      return <PartyResult url={`/party/${result.slug}`} Party={doc}/>;
    default:
      throw new Error(`unhandled search result type ${result.type}`);
  }
}

export default SearchResult;
