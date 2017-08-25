/* @flow */
import { graphql } from 'graphql';
import schema from '../../data/schema';

export default (query: string, variables?: ?{ [key: string]: any }): any => (
  graphql(schema, query, {}, {}, variables)
    .then((json: { data: any }) => json.data)
);
