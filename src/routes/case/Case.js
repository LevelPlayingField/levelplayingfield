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
import { Container, Row, Col } from '../../components/Grid';
import s from './Case.scss';
import first from '../../core/first';
import AwardsTable from './AwardsTable';
import { days, partyType, CONSUMER, NON_CONSUMER, ConsumerParty } from './utils';

function renderAttorneys(attorneys) {
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h4 className={s.heading}>Represented By</h4>
          </Col>
        </Row>

        {attorneys ? attorneys.map(attorney => (
          <Row key={`attorney_${attorney.Party.id}`}>
            <Col>
              <strong className={s.title}>
                <Link to={`/party/${attorney.Party.slug}`}>
                  {attorney.Party.name}
                </Link>
              </strong>

              { attorney.Firm && (
                <div className={s.detail}>
                  <Link to={`/party/${attorney.Firm.slug}`}>
                    {attorney.Firm.name}
                  </Link>
                </div>
              )}
            </Col>
          </Row>
        )) : (
          <Row>
            <Col>
              <strong>Unknown</strong>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
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
      <Container>
        <Row>
          <Col md={4} lg={4}>
            <Row>
              <Col><strong>Forum </strong> {case_.arbitration_board}</Col>
            </Row>

            <Row>
              <Col><strong>Case ID</strong> {case_.case_number}</Col>
            </Row>


            {case_.dispute_type && (
              <Row>
                <Col><strong>Type</strong> {case_.dispute_type}</Col>
              </Row>
            )}


            {case_.dispute_subtype && (
              <Row>
                <Col><strong>Subtype</strong> {case_.dispute_subtype}</Col>
              </Row>
            )}


            {case_.salary_range && (
              <Row>
                <Col><strong>Salary Range</strong> {case_.salary_range}</Col>
              </Row>
            )}
          </Col>
          <Col md={4} lg={4}>
            <Row>
              <Col>
                <strong>Filed</strong>&nbsp;
                {new Date(case_.filing_date).toLocaleDateString()}
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>Closed</strong>&nbsp;
                {new Date(case_.close_date).toLocaleDateString()}
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>Open</strong>&nbsp;
                {days(new Date(case_.close_date) - new Date(case_.filing_date))} Days
              </Col>
            </Row>
          </Col>
          <Col md={4} lg={4}>
            {firstArbitrator !== null ? (
              <div>
                <Row>
                  <Col>
                    <strong>Filing to appointment</strong>&nbsp;
                    {days(new Date(firstArbitrator.date) - new Date(case_.filing_date))} Days
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Appointment to close</strong>&nbsp;
                    {days(new Date(case_.close_date) - new Date(firstArbitrator.date))} Days
                  </Col>
                </Row>
              </div>
            ) : (
              <span>&nbsp;</span>
            )}
          </Col>
        </Row>

        <Row className={s.rowSpaced}>
          <Col md={4} lg={4}>
            <h4 className={s.subtitle}>Disposition</h4>
            <p className={s.details}>{case_.type_of_disposition}</p>
          </Col>
          <Col md={4} lg={4}>
            <h4 className={s.subtitle}>Prevailing Party</h4>
            <p className={s.details}>{case_.prevailing_party}</p>
          </Col>
          <Col md={4} lg={4}/>
        </Row>

        <Row className={s.rowSpaced}>
          <Col>
            {initiatedBy && <h2 className={s.subtitle}>Plaintiff</h2>}
            {plaintiff.slug
              ? (<h3><Link to={`/party/${plaintiff.slug}`}>{plaintiff.name}</Link></h3>)
              : (<h3>{plaintiff.name}</h3>)}

            {renderAttorneys(plaintiff.attorneys)}
          </Col>

          <Col>
            {initiatedBy && <h2 className={s.subtitle}>Defendant</h2>}
            {defendant.slug
              ? (<h3><Link to={`/party/${defendant.slug}`}>{defendant.name}</Link></h3>)
              : (<h3>{defendant.name}</h3>)}

            {renderAttorneys(defendant.attorneys)}
          </Col>

          <Col>
            <h2 className={s.subtitle}>
              {arbitrators.length === 1 ? 'Arbitrator' : 'Arbitrators'}
            </h2>
            {arbitrators.length > 0 ? arbitrators.map(arbitrator =>
              <Row>
                <Col key={`arbitrator_${arbitrator.Party.id}`}>
                  <h3>
                    <Link to={`/party/${arbitrator.Party.slug}`}>
                      {arbitrator.Party.name}
                    </Link>
                  </h3>
                  <p className={s.details}>
                    Appointed {new Date(arbitrator.date).toLocaleDateString()}
                  </p>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <h3 className={s.title}>Unknown</h3>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        <Row className={s.rowSpaced}>
          <Col md={6} lg={6}>
            <AwardsTable case_={case_}/>
          </Col>

          <Col md={6} lg={6}>
            <dl className={s.dl_horizontal}>
              <dt>Arbitration Details</dt>
              <dd/>
              <dt>Hearing</dt>
              <dd>{case_.type_of_hearing ? 'Yes' : 'No Hearing'}</dd>
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

            <dl className={s.dl_horizontal}>
              <dt>Other Data</dt>
              <dd/>
              <dt>Consumer Cases Involving Business</dt>
              <dd>{case_.arb_count}</dd>
              <dt>Mediated Cases Involving Business</dt>
              <dd>{case_.med_count}</dd>
              <dt>Arbitrations Involving Business</dt>
              <dd>{case_.arb_or_cca_count}</dd>
              <dt>Source of Authority</dt>
              <dd>{case_.source_of_authority}</dd>
            </dl>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

Case.propTypes = {
  case_: PropTypes.any.isRequired,
};

export default withStyles(s)(Case);
