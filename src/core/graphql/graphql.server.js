/* @flow */
import { graphql } from 'graphql';
import schema from '../../data/schema';


export default (query: string): any => (
  graphql(schema, query)
    .then((json: { data: any }) => json.data)
);
