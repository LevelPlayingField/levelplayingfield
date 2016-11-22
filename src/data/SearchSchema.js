/* @flow */
/* eslint no-use-before-define: "off" */
import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { attributeFields, resolver } from 'graphql-sequelize';
import JSONType from 'graphql-sequelize/lib/types/jsonType';
import searchQuery from 'search-query-parser';
import { Search } from './models';

const searchOptions = {
  keywords: [
    'is',
    'board',
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
    filters.push({ $or: is[key].map(v => [key, [v]]) });
  }

  return filters;
};
const filterRange = (field, { from, to }) => {
  if (from != null && to != null) {
    return [`${field} BETWEEN ? AND ?`, [from], [to]];
  }

  if (from != null) {
    if ((/^[<>]/.test(from))) {
      const op = from.substr(0, 1);
      const val = from.substr(1);

      return [`${field} ${op}= ?`, [val]];
    }

    return [`${field} = ?`, [from]];
  }

  return [];
};


export const SearchType = new GraphQLObjectType({
  name: 'Search',
  fields: () => ({
    ...attributeFields(Search),
    document: { type: JSONType },
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
};

export default {
  fields: {
    Search: {
      type: new GraphQLList(SearchType),
      resolve: resolver(Search, {
        before: (options, args) => {
          const parsed: ParsedType = searchQuery.parse(args.query, searchOptions);
          let where = options.where || {};
          let order = null;

          if (typeof parsed === 'string' || typeof parsed.text === 'string') {
            let term: string = '';
            if (typeof parsed === 'string') {
              term = parsed;
            }
            if (typeof parsed.text === 'string') {
              term = parsed.text;
            }

            order = `ts_rank(vector, plainto_tsquery('english', '${term.replace("'", "''")}')) DESC`;
            where = {
              $and: [
                where,
                {
                  $or: [
                    ["vector @@ plainto_tsquery('english', ?)", [term]],
                    { $and: term.split(/\s+/g).map(word => ['index ILIKE ?', [`%${word}%`]]) },
                  ],
                },
              ],
            };
          }

          if (typeof parsed !== 'string') {
            if (parsed.board != null && validateKeyword(parsed.board, ['aaa', 'jams'])) {
              where = { $and: [where, { $or: safeMap(parsed.board, b => ["lower(document->>'arbitration_board') = lower(?)", [b]]) }] };
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

          return { ...options, where, order };
        },
      }),
      args: {
        limit: { type: GraphQLInt, defaultValue: 10 },
        offset: { type: GraphQLInt, defaultValue: 0 },
        query: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLString },
      },
    },
  },
};
