/* @flow */
/* eslint no-use-before-define: "off" */
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import Sequelize from 'sequelize';
import { attributeFields } from 'graphql-sequelize';
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
    'state',
    'disposition',
    'awarded',
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

const NULL_VALUES = [
  '---',
  'unknown',
  'null',
];
const isNullValue = (v: string): bool => NULL_VALUES.indexOf(
  v.toLowerCase()) !== -1;

const PREVAILING_PARTIES = [
  ...NULL_VALUES,
  'business',
  'consumer/business',
  'consumer',
  'employee',
  'employee/business',
  'home owner/business',
  'home owner',
];

const DISPOSITIONS = [
  ...NULL_VALUES,
  'settled',
  'administrative',
  'dismissed',
  'awarded',
  'withdrawn',
  'impasse',
];

const validateKeyword = (word: KeywordType, match: RegExp | Array<string>) => {
  if (Array.isArray(match)) {
    const arr: Array<string> = match;

    return safeMap(word, w => arr.indexOf(w.toLowerCase()) !== -1)
      .reduce((a, b) => a && b, true);
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

  'law firm': 'document->>\'type\' ILIKE ?',
  'non consumer': 'document->>\'type\' ILIKE ?',
  attorney: 'document->>\'type\' ILIKE ?',
  arbitrator: 'document->>\'type\' ILIKE ?',
  consumer: 'document->>\'type\' ILIKE ?',
};
const convertIs = (vals: string | Array<string>) => {
  const filters = [];
  const is = safeMap(vals,
    val => val.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/\s+/g, ' '))
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

function buildQuery(parsed: ParsedType): [any, Array<any>] {
  let where = {};
  const order = [];

  if (typeof parsed === 'string' || typeof parsed.text === 'string') {
    let term: string = '';
    if (typeof parsed === 'string') {
      term = parsed;
    }
    if (typeof parsed.text === 'string') {
      term = parsed.text;
    }

    order.push(Sequelize.literal(
      `ts_rank(vector, plainto_tsquery('simple', '${term.replace('\'',
        '\'\'')}')) DESC`));
    where = {
      $and: [
        where,
        {
          $or: [
            ['vector @@ plainto_tsquery(\'simple\', ?)', term],
            {
              $and: term.split(/\s+/g)
                .map(word => ['index ILIKE ?', [`%${word}%`]]),
            },
          ],
        },
      ],
    };
  }

  if (typeof parsed !== 'string') {
    if (parsed.state != null) {
      where = {
        $and: [
          where,
          {
            $or: safeMap(parsed.state,
              s => ['document->>\'consumer_rep_state\' ILIKE ?', s]),
          }],
      };
    }
    if (parsed.board != null &&
      validateKeyword(parsed.board, ['aaa', 'jams'])) {
      where = {
        $and: [
          where,
          {
            $or: safeMap(parsed.board,
              b => ['document->>\'arbitration_board\' ILIKE ?', b]),
          }],
      };
    }
    if (parsed.disposition != null &&
      validateKeyword(parsed.disposition, DISPOSITIONS)) {
      where = {
        $and: [
          where,
          {
            $or: safeMap(parsed.disposition,
              d => ['document->>\'type_of_disposition\' ILIKE ?', d]),
          }],
      };
    }
    if (parsed.awarded != null &&
      validateKeyword(parsed.awarded, PREVAILING_PARTIES)) {
      where = {
        $and: [
          where, {
            $or: safeMap(parsed.awarded, a => isNullValue(a)
              ? ['document->>\'prevailing_party\' LIKE \'---\'']
              : ['document->>\'prevailing_party\' ILIKE ?', a],
            ),
          }],
      };
    }
    if (parsed.party != null) {
      where = {
        $and: [
          where,
          ...safeMap(parsed.party,
            p => ['(document->\'names\') ? ?', Sequelize.literal('?'), p])],
      };
    }
    if (parsed.filed != null &&
      validateRange(parsed.filed, /^[<>]?\d+\/\d+\/\d+$/)) {
      where = {
        $and: [
          where,
          filterRange('(document->>\'filing_date\')::DATE', parsed.filed)],
      };
    }
    if (parsed.closed != null &&
      validateRange(parsed.closed, /^[<>]?\d+\/\d+\/\d+$/)) {
      where = {
        $and: [
          where,
          filterRange('(document->>\'close_date\')::DATE', parsed.closed)],
      };
    }
    if (parsed.is != null) {
      where = { $and: [where, convertIs(parsed.is)] };
    }
  }

  if (parsed.exclude != null) {

  }
  return [where, order];
}

export const SearchType = new GraphQLObjectType({
  name: 'Search',
  fields: () => ({
    query: { type: GraphQLString },
    Results: {
      type: ResultsType,
      args: {
        page: { type: GraphQLInt, defaultValue: 1 },
        perPage: { type: GraphQLInt, defaultValue: 20 },
        sortBy: { type: GraphQLString },
        sortDir: {
          type: new GraphQLEnumType({
            name: 'SortDir',
            values: {
              ASC: { value: 'ASC' },
              DESC: { value: 'DESC' },
            },
          }),
          defaultValue: 'ASC',
        },
      },
      async resolve({ query }, { sortBy, sortDir, page, perPage }) {
        const parsed: ParsedType = searchQuery.parse(query, searchOptions);
        const [where, order] = buildQuery(parsed);

        // Fallback sorting to make sure we get some semblance of deterministic sort
        order.push(['id', 'asc']);

        // If user specific a sort, order by that first
        if (sortBy) {
          order.unshift([
            Sequelize.literal(`document->'${sortBy.replace('\'', '\'\'')}'`),
            sortDir,
          ]);
        }

        const results = await Search.findAndCount({
          where,
          order,
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
  text?: string,
  is?: KeywordType,
  board?: KeywordType,
  disposition?: KeywordType,
  awarded?: KeywordType,
  closed?: RangeType,
  filed?: RangeType,
  party?: string,
  exclude?: ParsedType,
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
