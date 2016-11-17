/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Search.scss';

import type { Result } from '../../data/containers/Search';

function SearchResult({ result }: { result: Result }) {
  switch (result.type) {
    case 'case':
      return (
        <li>
          <Link to={`/case/${result.id}`}>
            Case {result.document.case_number}
          </Link>
        </li>
      );
    case 'party':
      return (
        <li>
          <Link to={`/party/${result.slug}`}>
            {result.document.type} - {result.document.name}
          </Link>
        </li>
      );
    default:
      return null;
  }
}

export default withStyles(s)(SearchResult);
