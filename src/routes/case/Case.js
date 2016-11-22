/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import s from './Case.scss';
import first from '../../core/first';
import AwardsTable from './AwardsTable';
import { days, partyType, CONSUMER, NON_CONSUMER, ConsumerParty } from './utils';

function renderAttorneys(attorneys) {
  if (!attorneys) {
    return null;
  }

  return (
    <div>
      <h4 style={{ paddingBottom: 0 }}>Represented By</h4>
      <div className={s.row}>

        {attorneys.map(attorney => (
          <div key={`attorney_${attorney.Party.id}`} className={s.col_half}>
            <h3 className={s.title}>
              <Link to={`/party/${attorney.Party.slug}`}>
                {attorney.Party.name}
              </Link>
            </h3>

            { attorney.Firm && (
              <div className={s.detail}>
                <Link to={`/party/${attorney.Firm.slug}`}>
                  {attorney.Firm.name}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Case({ case_ }) {
  const initiatedBy = partyType(case_.initiating_party);
  const parties = case_.Parties.edges.map(edge => edge.node);
  const nonConsumer = first(parties.filter(node => node.Party.type === 'Non Consumer')).Party;
  const attorneys = parties.filter(node => node.Party.type === 'Attorney');
  const arbitrators = parties.filter(node => node.Party.type === 'Arbitrator');
  const firstArbitrator = first(arbitrators.sort(node => node.date));

  const plaintiff = initiatedBy === NON_CONSUMER ? nonConsumer : { ...ConsumerParty, attorneys };
  const defendant = initiatedBy === CONSUMER ? nonConsumer : { ...ConsumerParty, attorneys };

  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.row}>
            <div className={s.col_third}>
              <dl className={s.dl_horizontal}>
                <dt>Forum</dt>
                <dd>{case_.arbitration_board}</dd>
                {/* TODO: Fix */}

                <dt>Case ID</dt>
                <dd>{case_.case_number}</dd>
              </dl>
            </div>
            <div className={s.col_third}>
              <dl className={s.dl_horizontal}>
                <dt>Filed</dt>
                <dd>{new Date(case_.filing_date).toLocaleDateString()}</dd>
                <dt>Closed</dt>
                <dd>{new Date(case_.close_date).toLocaleDateString()}</dd>
                <dt>Open</dt>
                <dd>{days(new Date(case_.close_date) - new Date(case_.filing_date))} Days</dd>
              </dl>
            </div>
            <div className={s.col_third}>
              {firstArbitrator !== null ? (
                <dl className={s.dl_horizontal}>
                  <dt>Filing to appointment</dt>
                  <dd>{days(new Date(firstArbitrator.date) - new Date(case_.filing_date))} Days
                  </dd>
                  <dt>Appointment to close</dt>
                  <dd>{days(new Date(case_.close_date) - new Date(firstArbitrator.date))} Days</dd>
                </dl>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
          </div>

          <h2 className={s.title}>{arbitrators.length === 1 ? 'Arbitrator' : 'Arbitrators'}</h2>
          <div className={s.row}>

            {arbitrators.length > 0 ? arbitrators.map(arbitrator =>
              <div className={s.col_third} key={`arbitrator_${arbitrator.Party.id}`}>
                <h3 className={s.title}>
                  <Link to={`/party/${arbitrator.Party.slug}`}>
                    {arbitrator.Party.name}
                  </Link>
                </h3>
                <p className={s.details}>
                  Appointed {new Date(arbitrator.date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className={s.col_full}>
                <h3 className={s.title}>Unknown</h3>
              </div>
            )}
          </div>

          <div className={s.row}>
            <div className={s.col_half}>
              {initiatedBy && <h2 className={s.subtitle}>Plaintiff</h2>}
              {plaintiff.slug
                ? (<h3><Link to={`/party/${plaintiff.slug}`}>{plaintiff.name}</Link></h3>)
                : (<h3>{plaintiff.name}</h3>)}

              {plaintiff.attorneys && renderAttorneys(plaintiff.attorneys)}
            </div>

            <div className={s.col_half}>
              {initiatedBy && <h2 className={s.subtitle}>Defendant</h2>}
              {defendant.slug
                ? (<h3><Link to={`/party/${defendant.slug}`}>{defendant.name}</Link></h3>)
                : (<h3>{defendant.name}</h3>)}

              {defendant.attorneys && renderAttorneys(defendant.attorneys)}
            </div>
          </div>

          <div className={s.row}>
            <div className={s.col_third}>
              <h4 className={s.subtitle}>Type of Dispute</h4>
              {case_.dispute_type && (
                <p className={s.details}>{case_.dispute_type}</p>
              )}
              {case_.dispute_subtype && (
                <p className={s.details}>{case_.dispute_subtype}</p>
              )}
              {case_.salary_range && (
                <p className={s.details}>{case_.salary_range}</p>
              )}
            </div>
            <div className={s.col_third}>
              <h4 className={s.subtitle}>Disposition</h4>
              <p className={s.details}>{case_.type_of_disposition}</p>
            </div>
            <div className={s.col_third}>
              <h4 className={s.subtitle}>Prevailing Party</h4>
              <p className={s.details}>{case_.prevailing_party}</p>
            </div>
          </div>
          <div className={s.row}>
            <div className={s.col_half}>
              <AwardsTable case_={case_}/>
            </div>
          </div>

          <div className={s.row}>
            <div className={s.col_third}>
              <h4 className={s.subtitle}>Arbitration Details</h4>
              <dl className={s.dl_horizontal}>
                <dt>Hearing</dt>
                <dd>{case_.type_of_hearing ? 'Yes' : 'No'}</dd>
                {case_.type_of_hearing && [
                  <dt>Hearing Type</dt>,
                  <dd>{case_.type_of_hearing}</dd>,
                ]}
                {case_.document_only_proceeding && [
                  <dt>Documents Only</dt>,
                  <dd>{case_.document_only_proceeding}</dd>,
                ]}
                {case_.hearing_state && [
                  <dt>Hearing Location</dt>,
                  <dd>{`${case_.hearing_city}, ${case_.hearing_state}`}</dd>,
                ]}
              </dl>
            </div>
            <div className={s.col_two_third}>
              <h4 className={s.subtitle}>Other Data</h4>
              <dl className={s.dl_horizontal}>
                <dt>Consumer Cases Involving Business</dt>
                <dd>{case_.arb_count}</dd>
                <dt>Mediated Cases Involving Business</dt>
                <dd>{case_.med_count}</dd>
                <dt>Arbitrations Involving Business</dt>
                <dd>{case_.arb_or_cca_count}</dd>
                <dt>Source of Authority</dt>
                <dd>{case_.source_of_authority}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Case.propTypes = {
  case_: PropTypes.any.isRequired,
};

export default withStyles(s)(Case);
