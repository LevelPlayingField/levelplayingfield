/* @flow */

import fetch from '../fetch';

export default (query: string): any => (
  fetch('/graphql', {
    body: JSON.stringify({ query }),
    method: 'post',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(resp => resp.json())
    .then(json => json.data)
);
