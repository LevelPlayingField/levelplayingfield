/* @flow */

import fetch from '../fetch';

export default (query: string, variables?: ?{ [key: string]: any }): any => (
  fetch('/graphql', {
    body: JSON.stringify({ query, variables }),
    method: 'post',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(resp => resp.json())
    .then((json: { data: any }) => json.data)
);
