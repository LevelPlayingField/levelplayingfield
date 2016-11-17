import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import queryString from 'query-string';
import s from './Pager.scss';
import Link from '../Link';

function Pager({ queryKey = 'page', pageInfo }, { history }) {
  const { pathname, search } = history && history.location;
  const beforeKey = `before${queryKey}`;
  const afterKey = `after${queryKey}`;
  const prevParams = queryString.parse(search);
  const nextParams = queryString.parse(search);

  prevParams[beforeKey] = pageInfo.startCursor;
  delete prevParams[afterKey];
  delete nextParams[beforeKey];
  nextParams[afterKey] = pageInfo.endCursor;

  const prevPage = `${pathname}?${queryString.stringify(prevParams)}`;
  const nextPage = `${pathname}?${queryString.stringify(nextParams)}`;

  return (
    <ul className={s.pagination}>
      {pageInfo.hasPreviousPage && (
        <li className={s.prev}>
          <Link to={prevPage}>
            &lt; Prev
          </Link>
        </li>
      )}
      {pageInfo.hasNextPage && (
        <li className={s.next}>
          <Link to={nextPage}>
            Next &gt;
          </Link>
        </li>
      )}
    </ul>
  );
}

function page(queryKey, limit = 10) {
  return (query) => {
    const beforeKey = `before${queryKey}`;
    const afterKey = `after${queryKey}`;

    const before = query[beforeKey];
    const after = query[afterKey];

    if (before) {
      return `last: ${limit}, before: "${before}"`;
    } else if (after) {
      return `first: ${limit}, after: "${after}"`;
    }
    return `first: ${limit}`;
  };
}

Pager.contextTypes = {
  history: PropTypes.any.isRequired,
};

Pager.propTypes = {
  queryKey: PropTypes.string,
  pageInfo: PropTypes.any.isRequired,
};

export default withStyles(s)(Pager);
export {
  page,
};
