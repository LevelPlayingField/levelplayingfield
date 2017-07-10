/* @flow */

import React from 'react';
import { Container, Row, Col } from '../../components/Grid';
import s from './Search.scss';
import SearchResult from './SearchResult';

export default ({ loading, results }) => (
  <Row>
    <Col>
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.cell1}>
              Case
            </th>
            <th className={s.cell2}>
              Plaintiff
            </th>
            <th className={s.cell3}>
              Defendant
            </th>
            <th className={s.cell4}/>
            <th className={s.cell5}>
              Disposition
            </th>
            <th className={s.cell6}>
              Filed
            </th>
          </tr>
          <tr>
            <th className={s.cell1}>
              Dispute Type
            </th>
            <th className={s.cell2}>
              Plaintiff Counsel
            </th>
            <th className={s.cell3}>
              Defendant Counsel
            </th>
            <th className={s.cell4}>
              Arbitrator
            </th>
            <th className={s.cell5}>
              Awardee
            </th>
            <th className={s.cell6}>
              Closed
            </th>
          </tr>
        </thead>

        {loading && (
          <tbody>
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
            </tr>
          </tbody>
        )}

        {results && results.map((result: Result) =>
          <SearchResult result={result} key={`result_${result.type}_${result.id}`}/>
        )}
      </table>
    </Col>
  </Row>
)