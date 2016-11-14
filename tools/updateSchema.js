import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import schema from '../src/data/schema';

export default async function updateSchema() {
  const dataPath = path.join(__dirname, '../src/data/');
  const result = await graphql(schema, introspectionQuery);

  if (result.errors) {
    throw new Error(`Error introspecting schema: ${JSON.stringify(result.errors, null, 2)}`);
  }

  fs.writeFileSync(path.join(dataPath, 'schema.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(dataPath, 'schema.graphql'), printSchema(schema));
}
