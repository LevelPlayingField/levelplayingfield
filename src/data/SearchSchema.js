/* @flow */
/* eslint no-use-before-define: "off" */
import {
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import Sequelize from 'sequelize';
import { attributeFields, resolver } from 'graphql-sequelize';
import JSONType from 'graphql-sequelize/lib/types/jsonType';
import searchQuery from 'search-query-parser';
import { Search } from './models';
import patchEscapeLiteral from './sequelizePatchLiteral';

patchEscapeLiteral();

export const searchOptions = {
  keywords: [
    'is',
    'board',
    'party',
  ],
  groups: {
    is: [
      ['case', 'party'],
    ],
  },
  ranges: [
    'filed',
    'closed',
  ],
};


const validateKeyword = (word: KeywordType, match: RegExp | Array<string>) => {
  if (Array.isArray(match)) {
    const arr: Array<string> = match;

    return safeMap(word, w => arr.indexOf(w) !== -1).reduce((a, b) => a && b, true);
  }

  const re: RegExp = match;

  return safeMap(word, w => re.test(w)).reduce((a, b) => a && b, true);
};

const validateRange = ({ from, to }: RangeType, re: RegExp): bool => {
  if (to != null && !re.test(to)) {
    return false;
  }
  return re.test(from);
};

const safeMap = (val: any | Array<any>, func): Array<any> => (
  typeof val === 'string'
    ? [val].map(func)
    : val.map(func)
);
const remapIs = {
  lawfirm: 'law firm',
  nonconsumer: 'non consumer',
};
const isTypes = {
  case: 'type = ?',
  party: 'type = ?',

  'law firm': "lower(document->>'type') ILIKE ?",
  'non consumer': "lower(document->>'type') ILIKE ?",
  attorney: "lower(document->>'type') ILIKE ?",
  arbitrator: "lower(document->>'type') ILIKE ?",
  consumer: "lower(document->>'type') ILIKE ?",
};
const convertIs = (vals: string | Array<string>) => {
  const filters = [];
  const is = safeMap(vals, val => val.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/\s+/g, ' '))
    .map(val => (val in remapIs ? remapIs[val] : val))
    .reduce((groups, val) => {
      if (val in isTypes) {
        if (!groups[isTypes[val]]) {
          groups[isTypes[val]] = []; // eslint-disable-line no-param-reassign
        }
        groups[isTypes[val]].push(val);
      }

      return groups;
    }, {});

  for (const key of Object.keys(is)) {
    filters.push({ $or: is[key].map(v => [key, v]) });
  }

  return filters;
};
const filterRange = (field, { from, to }) => {
  if (from != null && to != null) {
    return [`${field} BETWEEN ? AND ?`, from, to];
  }

  if (from != null) {
    if ((/^[<>]/.test(from))) {
      const op = from.substr(0, 1);
      const val = from.substr(1);

      return [`${field} ${op}= ?`, val];
    }

    return [`${field} = ?`, from];
  }

  return [];
};

export const SearchType = new GraphQLObjectType({
  name: 'Search',
  fields: () => ({
    query: { type: GraphQLString },
    Results: {
      type: ResultsType,
      args: {
        page: { type: GraphQLInt, defaultValue: 1 },
        perPage: { type: GraphQLInt, defaultValue: 20 },
      },
      async resolve({ query }, { page, perPage }) {
        const parsed: ParsedType = searchQuery.parse(query, searchOptions);

        let where = {};
        let order = null;

        if (typeof parsed === 'string' || typeof parsed.text === 'string') {
          let term: string = '';
          if (typeof parsed === 'string') {
            term = parsed;
          }
          if (typeof parsed.text === 'string') {
            term = parsed.text;
          }

          if (order == null) {
            order = `ts_rank(vector, plainto_tsquery('english', '${term.replace("'", "''")}')) DESC`;
          }
          where = {
            $and: [
              where,
              {
                $or: [
                  ["vector @@ plainto_tsquery('english', ?)", term],
                  { $and: term.split(/\s+/g).map(word => ['index ILIKE ?', [`%${word}%`]]) },
                ],
              },
            ],
          };
        }

        if (typeof parsed !== 'string') {
          if (parsed.board != null && validateKeyword(parsed.board, ['aaa', 'jams'])) {
            where = { $and: [where, { $or: safeMap(parsed.board, b => ["lower(document->>'arbitration_board') = lower(?)", b]) }] };
          }
          if (parsed.party != null) {
            where = { $and: [where, ...safeMap(parsed.party, p => ["(document->'names') ? ?", Sequelize.literal('?'), p])] };
          }
          if (parsed.filed != null && validateRange(parsed.filed, /^[<>]?\d+\/\d+\/\d+$/)) {
            where = { $and: [where, filterRange("(document->>'filing_date')::DATE", parsed.filed)] };
          }
          if (parsed.closed != null && validateRange(parsed.closed, /^[<>]?\d+\/\d+\/\d+$/)) {
            where = { $and: [where, filterRange("(document->>'close_date')::DATE", parsed.closed)] };
          }
          if (parsed.is != null) {
            where = { $and: [where, convertIs(parsed.is)] };
          }
        }

        if (order == null) {
          order = 'id asc';
        }

        const results = await Search.findAndCount({
          where,
          limit: perPage,
          offset: (page - 1) * perPage,
        });

        return {
          query,
          page,
          pages: Math.ceil(results.count / perPage),
          perPage,
          where,
          order,
          total: results.count,
          edges: results.rows.map(result => ({
            cursor: `${result.type}:${result.id}`,
            node: result,
          })),
        };

      },
    },
  }),
});

export const ResultsType = new GraphQLObjectType({
  name: 'Results',
  fields: () => ({
    total: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    perPage: { type: GraphQLInt },
    hasPrevPage: {
      type: GraphQLBoolean,
      resolve({ page }) {
        return page > 1;
      },
    },
    hasNextPage: {
      type: GraphQLBoolean,
      resolve({ total, page, perPage }) {
        return (page * perPage) < total;
      },
    },
    edges: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'ResultEdge',
        fields: () => ({
          cursor: { type: GraphQLString },
          node: {
            type: new GraphQLObjectType({
              name: 'ResultNode',
              fields: () => ({
                ...attributeFields(Search),
                document: { type: JSONType },
              }),
            }),
          },
        }),
      })),
    },
  }),
});

type KeywordType = string | Array<string>;
type RangeType = {
  from: string,
  to: ?string
};
type ParsedType = string | {
  text: ?string,
  is: ?KeywordType,
  board: ?KeywordType,
  closed: ?RangeType,
  filed: ?RangeType,
  party: ?string,
};

export default {
  fields: {
    Search: {
      type: SearchType,
      resolve(context: any, { query }: { query: string }) {
        return { query };
      },
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
      },
    },
  },
};
