import fetch from './fetch';

export default (query) => fetch('/graphql', {
  body: JSON.stringify({ query }),
  method: 'post',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
