/* @flow */

import React from 'react';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
import s from './Search.scss';

export default ({ page, pages, perPage, query }) => (
  <Row>
    <Col>
      <ul className={s.pagination}>
        {/* Page 1, if gt page 1 */}
        <li>
          {page > 1 ? (
            <Link to={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
              Last {perPage}
            </Link>
          ) : (
            <span>Last {perPage}</span>
          )}
        </li>

        <li><span>Page {page} of {pages}</span></li>

        <li>
          {page < pages ? (
            <Link to={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
              Next {perPage}
            </Link>
          ) : (
            <span>Next {perPage}</span>
          )}
        </li>
      </ul>
    </Col>
  </Row>
);