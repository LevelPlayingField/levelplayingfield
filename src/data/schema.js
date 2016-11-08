import {
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID
} from 'graphql';
import { defaultListArgs, attributeFields, resolver, relay } from 'graphql-sequelize';
import { Case, Party, CaseParty } from './models';

const CasePartyType = new GraphQLObjectType({
  name:   'CaseParty',
  fields: () => Object.assign(attributeFields(CaseParty), {
    Case:  {
      type:    CaseType,
      resolve: resolver(CaseParty.Case)
    },
    Party: {
      type:    PartyType,
      resolve: resolver(CaseParty.Party)
    },
    Firm:  {
      type:    PartyType,
      resolve: resolver(CaseParty.Firm)
    },
  })
});


const PartyType = new GraphQLObjectType({
  name:   'Party',
  fields: () => Object.assign(attributeFields(Party), {
    Cases:     {
      type:    PartyCasesConnection.connectionType,
      resolve: PartyCasesConnection.resolve,
      args:    {
        ...PartyCasesConnection.connectionArgs,
      }
    },
    FirmCases: {
      type:    PartyFirmCasesConnection.connectionType,
      resolve: PartyFirmCasesConnection.resolve,
      args:    {
        ...PartyFirmCasesConnection.connectionArgs,
      }
    },
    Attorneys: {
      type:    PartyAttorneysConnection.connectionType,
      resolve: PartyAttorneysConnection.resolve,
      args:    {
        ...PartyAttorneysConnection.connectionArgs,
      }
    },
    Firms:     {
      type:    PartyFirmsConnection.connectionType,
      resolve: PartyFirmsConnection.resolve,
      args:    {
        ...PartyFirmsConnection.connectionArgs,
      }
    },
  })
});

const CaseType = new GraphQLObjectType({
  name:   Case.name,
  fields: () => Object.assign(attributeFields(Case), {
    Parties: {
      type:    CasePartiesConnection.connectionType,
      resolve: CasePartiesConnection.resolve,
      args:    {
        ...CasePartiesConnection.connectionArgs,
      }
    },
  }),
});

const CasePartiesConnection = relay.sequelizeConnection({
  name:             'caseParty',
  nodeType:         CasePartyType,
  target:           Case.Parties,
  where:            (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type:    GraphQLInt,
      resolve: ({ source }) => source.countParties()
    }
  }
});

const PartyCasesConnection = relay.sequelizeConnection({
  name:             'cases',
  nodeType:         CasePartyType,
  target:           Party.Cases,
  where:            (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type:    GraphQLInt,
      resolve: ({ source }) => source.countCases()
    }
  }
});

const PartyFirmCasesConnection = relay.sequelizeConnection({
  name:             'firmCases',
  nodeType:         CasePartyType,
  target:           Party.FirmCases,
  where:            (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type:    GraphQLInt,
      resolve: ({ source }) => source.countFirmCases()
    }
  }
});


const PartyFirmsConnection = relay.sequelizeConnection({
  name:             'firms',
  nodeType:         PartyType,
  target:           Party.Firms,
  where:            (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type:    GraphQLInt,
      resolve: ({ source }) => source.countFirms()
    }
  }
});

const PartyAttorneysConnection = relay.sequelizeConnection({
  name:             'attorneys',
  nodeType:         PartyType,
  target:           Party.Attorneys,
  where:            (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type:    GraphQLInt,
      resolve: ({ source }) => source.countAttorneys()
    }
  }
});


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name:   'Query',
    fields: () => ({
      Cases:   {
        type:    new GraphQLList(CaseType),
        resolve: resolver(Case),
        args:    Object.assign(defaultListArgs(), {}),
      },
      Parties: {
        type:    new GraphQLList(PartyType),
        resolve: resolver(Party),
        args:    Object.assign(defaultListArgs(), {}),
      },
      Case:    {
        type:    CaseType,
        resolve: resolver(Case),
        args:    {
          id: { type: new GraphQLNonNull(GraphQLID) },
        }
      },
      Party:   {
        type: PartyType,
        resolve(args, context, ...extra) {
          if (!(context.id || context.slug)) {
            throw new Error('id or slug is required')
          }

          let data = resolver(Party)(args, context, ...extra);

          console.log(data);

          return data;
        },
        args: {
          id:   { type: GraphQLID },
          slug: { type: GraphQLString },
        }
      },
    }),
  }),
});

export default schema;
