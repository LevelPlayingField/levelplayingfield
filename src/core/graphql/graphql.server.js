import { graphql } from 'graphql';
import schema from '../../data/schema';


export default (query) => (
  graphql(schema, query)
    .then(json => json.data)
);
