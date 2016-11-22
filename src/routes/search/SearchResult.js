/* @flow */
/* eslint-disable no-case-declarations */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Search.scss';

import type { Result, PartyType, CaseType } from '../../data/containers/Search';
import { NON_CONSUMER, partyType } from '../case/utils';
import first from '../../core/first';

function cell(url) {
  return withStyles(s)(
    ({ children, ...props }: { children: Array<any> }) => (
      <td {...props}><Link className={s.cellLink} to={url}>{children}</Link></td>
    )
  );
}

function CaseResult({ url, Case }: { url: string, Case: CaseType }) {
  const C = cell(url);
  const initiatedBy = partyType(Case.initiating_party);
  const consumer = {
    party_name: 'Consumer',
    attorneys: Case.parties.filter(party => party.type === 'Attorney'),
  };
  const nonConsumer = first(Case.parties.filter(party => party.type === 'Non Consumer'));
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
      <tr>
        <C>{Case.case_number}</C>
        <C>{plaintiff.party_name}</C>
        <C>{defendant.party_name}</C>
        <C>{Case.arbitration_board}</C>
        <C>{Case.type_of_disposition}</C>
        <C>{new Date(Case.filing_date).toLocaleDateString()}</C>
      </tr>
      <tr>
        <C>{Case.dispute_type}</C>
        <C>
          {plaintiff.attorneys && plaintiff.attorneys.length
            ? plaintiff.attorneys.map(p => `${p.party_name} - ${p.firm_name}`).join(', ')
            : '---'}
        </C>
        <C>
          {defendant.attorneys
            ? defendant.attorneys.map(p => `${p.party_name} - ${p.firm_name}`).join(', ')
            : '---'}
        </C>
        <C>{arbitrators.map(p => p.party_name).join(', ')}</C>
        <C>{Case.prevailing_party}</C>
        <C>{new Date(Case.close_date).toLocaleDateString()}</C>
      </tr>
    </tbody>
  );
}

function PartyResult({ url, Party }: { url: string, Party: PartyType }) {
  const C = cell(url);

  return (
    <tbody className={s.resultRow}>
      <tr>
        <C>{Party.type}</C>
        <C>{Party.name}</C>
        <C colSpan={4}>{
          (Party.firms && `Firms: ${Party.firms.map(firm => firm.name).join(', ')}`) ||
          (Party.attorneys && `Attorneys: ${Party.attorneys.map(attorney => attorney.name).join(', ')}`) ||
          null}
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

export default withStyles(s)(SearchResult);
