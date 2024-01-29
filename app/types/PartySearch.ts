import type { SerializeFrom } from "@remix-run/node";

export type SummaryData = Record<string, Record<string, Record<string, number>>>;

export type PartyType = "Arbitrator" | "Attorney" | "Law Firm" | "Non Consumer";
export type PartyDocument = {
  id: number;
  name: string;
  slug: string;
  type: PartyType;
  case_count: number;
  created_at: Date;
  updated_at: Date;
  aggregate_data: SummaryData;

  firms: null | Array<Omit<PartyDocument, "case_count" | "firms" | "attorneys">>;
  attorneys: null | Array<Omit<PartyDocument, "case_count" | "firms" | "attorneys">>;
};

export const results: Array<
  SerializeFrom<{
    type: "party";
    id: number;
    slug: string;
    index: string;
    document: PartyDocument;
  }>
> = [
  {
    type: "party",
    id: 9038,
    slug: "arbitrator-james-h-boykin-esq",
    index: "Arbitrator James H Boykin Esq.",
    document: {
      id: 9038,
      name: "James H Boykin Esq.",
      slug: "arbitrator-james-h-boykin-esq",
      type: "Arbitrator",
      firms: null,
      attorneys: null,
      case_count: 7,
      created_at: "2017-02-08T23:56:44.154+00:00",
      updated_at: "2017-02-08T23:56:44.154+00:00",
      aggregate_data: {
        types: {
          "2013": {
            Consumer: 1,
          },
          "2014": {
            Consumer: 2,
          },
          "2015": {
            Consumer: 3,
          },
          "2019": {
            Consumer: 1,
          },
        },
        awards: {
          "2014": {
            Unknown: 2,
          },
          "2015": {
            Unknown: 2,
          },
        },
        dispositions: {
          "2013": {
            Administrative: 1,
          },
          "2014": {
            Awarded: 2,
          },
          "2015": {
            Awarded: 2,
            Settled: 1,
          },
          "2019": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 25886,
    slug: "attorney-todd-wozniak",
    index: "Attorney Todd Wozniak",
    document: {
      id: 25886,
      name: "Todd Wozniak",
      slug: "attorney-todd-wozniak",
      type: "Attorney",
      firms: [
        {
          id: 10206,
          name: "Greenberg Traurig",
          slug: "law-firm-greenberg-traurig",
          type: "Law Firm",
          created_at: "2017-02-08T23:57:26.395+00:00",
          updated_at: "2017-02-08T23:57:26.395+00:00",
          aggregate_data: {
            types: {
              "2010": {
                Employment: 1,
              },
              "2015": {
                Employment: 1,
              },
            },
            dispositions: {
              "2010": {
                Settled: 1,
              },
              "2015": {
                Settled: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2017-02-09T00:10:07.147+00:00",
      updated_at: "2017-02-09T00:10:07.147+00:00",
      aggregate_data: {
        types: {
          "2015": {
            Employment: 1,
          },
        },
        dispositions: {
          "2015": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 5697,
    slug: "non-consumer-addys-harbor-dodge-llc",
    index: "Non Consumer Addy's Harbor Dodge, LLC",
    document: {
      id: 5697,
      name: "Addy's Harbor Dodge, LLC",
      slug: "non-consumer-addys-harbor-dodge-llc",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2017-02-08T23:54:53.37+00:00",
      updated_at: "2017-02-08T23:54:53.37+00:00",
      aggregate_data: {
        types: {
          "2009": {
            Consumer: 1,
          },
        },
        awards: {
          "2009": {
            Unknown: 1,
          },
        },
        dispositions: {
          "2009": {
            Awarded: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 41011,
    slug: "attorney-marc-homme",
    index: "Attorney Marc Homme",
    document: {
      id: 41011,
      name: "Marc Homme",
      slug: "attorney-marc-homme",
      type: "Attorney",
      firms: [
        {
          id: 41012,
          name: "Marc S. Homme, APLC",
          slug: "law-firm-marc-s-homme-aplc",
          type: "Law Firm",
          created_at: "2019-08-09T18:58:12.278+00:00",
          updated_at: "2019-08-09T18:58:12.278+00:00",
          aggregate_data: {
            types: {
              "2018": {
                Consumer: 1,
              },
            },
            awards: {
              "2018": {
                Unknown: 1,
              },
            },
            dispositions: {
              "2018": {
                Awarded: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2019-08-09T18:58:12.223+00:00",
      updated_at: "2019-08-09T18:58:12.223+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        awards: {
          "2018": {
            Unknown: 1,
          },
        },
        dispositions: {
          "2018": {
            Awarded: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 42422,
    slug: "attorney-david-stern",
    index: "Attorney David Stern",
    document: {
      id: 42422,
      name: "David Stern",
      slug: "attorney-david-stern",
      type: "Attorney",
      firms: [
        {
          id: 42423,
          name: "Elliott Stern & Calabrese, LLP",
          slug: "law-firm-elliott-stern-calabrese-llp",
          type: "Law Firm",
          created_at: "2019-08-09T19:28:17.03+00:00",
          updated_at: "2019-08-09T19:28:17.03+00:00",
          aggregate_data: {
            types: {
              "2018": {
                Consumer: 1,
              },
            },
            dispositions: {
              "2018": {
                Administrative: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2019-08-09T19:28:16.98+00:00",
      updated_at: "2019-08-09T19:28:16.98+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2018": {
            Administrative: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 23154,
    slug: "attorney-shelly-farber",
    index: "Attorney Shelly Farber",
    document: {
      id: 23154,
      name: "Shelly Farber",
      slug: "attorney-shelly-farber",
      type: "Attorney",
      firms: [
        {
          id: 23155,
          name: "Law Offices of Farber & Farber",
          slug: "law-firm-law-offices-of-farber-farber",
          type: "Law Firm",
          created_at: "2017-02-09T00:07:40.728+00:00",
          updated_at: "2017-02-09T00:07:40.728+00:00",
          aggregate_data: {
            types: {
              "2015": {
                Employment: 1,
              },
            },
            dispositions: {
              "2015": {
                Settled: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2017-02-09T00:07:40.715+00:00",
      updated_at: "2017-02-09T00:07:40.715+00:00",
      aggregate_data: {
        types: {
          "2015": {
            Employment: 1,
          },
        },
        dispositions: {
          "2015": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 32144,
    slug: "attorney-kevin-groseclose",
    index: "Attorney Kevin Groseclose",
    document: {
      id: 32144,
      name: "Kevin Groseclose",
      slug: "attorney-kevin-groseclose",
      type: "Attorney",
      firms: [
        {
          id: 32145,
          name: "Miller & Durham, PLLC",
          slug: "law-firm-miller-durham-pllc",
          type: "Law Firm",
          created_at: "2017-08-21T18:05:56.377+00:00",
          updated_at: "2017-08-21T18:05:56.377+00:00",
          aggregate_data: {
            types: {
              "2017": {
                Consumer: 1,
              },
              "2018": {
                Consumer: 1,
              },
            },
            dispositions: {
              "2017": {
                Settled: 1,
              },
              "2018": {
                Dismissed: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2017-08-21T18:05:56.363+00:00",
      updated_at: "2017-08-21T18:05:56.363+00:00",
      aggregate_data: {
        types: {
          "2017": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2017": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 23851,
    slug: "law-firm-marchant-thorsen-honey-baldwin-meyer-llp",
    index: "Law Firm Marchant, Thorsen, Honey, Baldwin & Meyer, LLP",
    document: {
      id: 23851,
      name: "Marchant, Thorsen, Honey, Baldwin & Meyer, LLP",
      slug: "law-firm-marchant-thorsen-honey-baldwin-meyer-llp",
      type: "Law Firm",
      firms: null,
      attorneys: [
        {
          id: 23850,
          name: "James Thorsen",
          slug: "attorney-james-thorsen",
          type: "Attorney",
          created_at: "2017-02-09T00:08:17.535+00:00",
          updated_at: "2017-02-09T00:08:17.535+00:00",
          aggregate_data: {
            types: {
              "2015": {
                Employment: 1,
              },
            },
            awards: {
              "2015": {
                Unknown: 1,
              },
            },
            dispositions: {
              "2015": {
                Awarded: 1,
              },
            },
          },
        },
      ],
      case_count: 1,
      created_at: "2017-02-09T00:08:17.547+00:00",
      updated_at: "2017-02-09T00:08:17.547+00:00",
      aggregate_data: {
        types: {
          "2015": {
            Employment: 1,
          },
        },
        awards: {
          "2015": {
            Unknown: 1,
          },
        },
        dispositions: {
          "2015": {
            Awarded: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 42583,
    slug: "law-firm-hurst-sawyer-llc",
    index: "Law Firm Hurst & Sawyer LLC",
    document: {
      id: 42583,
      name: "Hurst & Sawyer LLC",
      slug: "law-firm-hurst-sawyer-llc",
      type: "Law Firm",
      firms: null,
      attorneys: [
        {
          id: 42582,
          name: "Eric Hurst",
          slug: "attorney-eric-hurst",
          type: "Attorney",
          created_at: "2019-08-09T19:30:55.619+00:00",
          updated_at: "2019-08-09T19:30:55.619+00:00",
          aggregate_data: {
            types: {
              "2018": {
                Consumer: 1,
              },
            },
            awards: {
              "2018": {
                "Home Owner": 1,
              },
            },
            dispositions: {
              "2018": {
                Awarded: 1,
              },
            },
          },
        },
      ],
      case_count: 1,
      created_at: "2019-08-09T19:30:55.67+00:00",
      updated_at: "2019-08-09T19:30:55.67+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        awards: {
          "2018": {
            "Home Owner": 1,
          },
        },
        dispositions: {
          "2018": {
            Awarded: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 42166,
    slug: "attorney-michael-hughes",
    index: "Attorney Michael Hughes",
    document: {
      id: 42166,
      name: "Michael Hughes",
      slug: "attorney-michael-hughes",
      type: "Attorney",
      firms: [
        {
          id: 42167,
          name: "McCormick Gordon Bloskey & Poirier, P.A.",
          slug: "law-firm-mccormick-gordon-bloskey-poirier-pa",
          type: "Law Firm",
          created_at: "2019-08-09T19:22:56.99+00:00",
          updated_at: "2019-08-09T19:22:56.99+00:00",
          aggregate_data: {
            types: {
              "2018": {
                Consumer: 1,
              },
            },
            dispositions: {
              "2018": {
                Settled: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2019-08-09T19:22:56.38+00:00",
      updated_at: "2019-08-09T19:22:56.38+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2018": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 1552,
    slug: "attorney-james-gleason",
    index: "Attorney James Gleason",
    document: {
      id: 1552,
      name: "James Gleason",
      slug: "attorney-james-gleason",
      type: "Attorney",
      firms: [
        {
          id: 1553,
          name: "Woodmen of the World Life Insurance Society",
          slug: "law-firm-woodmen-of-the-world-life-insurance-society",
          type: "Law Firm",
          created_at: "2017-02-08T23:52:51.423+00:00",
          updated_at: "2017-02-08T23:52:51.423+00:00",
          aggregate_data: {
            types: {
              "2009": {
                Consumer: 1,
              },
              "2011": {
                Consumer: 1,
              },
              "2012": {
                Consumer: 1,
              },
            },
            awards: {
              "2012": {
                Business: 1,
              },
            },
            dispositions: {
              "2009": {
                Settled: 1,
              },
              "2011": {
                Settled: 1,
              },
              "2012": {
                Awarded: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 1,
      created_at: "2017-02-08T23:52:51.414+00:00",
      updated_at: "2017-02-08T23:52:51.414+00:00",
      aggregate_data: {
        types: {
          "2009": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2009": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 27996,
    slug: "non-consumer-first-choice-bank-inc",
    index: "Non Consumer First Choice Bank, Inc.",
    document: {
      id: 27996,
      name: "First Choice Bank, Inc.",
      slug: "non-consumer-first-choice-bank-inc",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2017-02-09T00:13:06.982+00:00",
      updated_at: "2017-02-09T00:13:06.982+00:00",
      aggregate_data: {
        types: {
          "2014": {
            Employment: 1,
          },
        },
        dispositions: {
          "2014": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 10792,
    slug: "attorney-mark-oconnor",
    index: "Attorney Mark O'Connor",
    document: {
      id: 10792,
      name: "Mark O'Connor",
      slug: "attorney-mark-oconnor",
      type: "Attorney",
      firms: [
        {
          id: 10793,
          name: "O'Connor Law Group, PC",
          slug: "law-firm-oconnor-law-group-pc",
          type: "Law Firm",
          created_at: "2017-02-08T23:57:50.38+00:00",
          updated_at: "2017-02-08T23:57:50.38+00:00",
          aggregate_data: {
            types: {
              "2013": {
                Consumer: 1,
              },
              "2021": {
                Consumer: 1,
              },
            },
            dispositions: {
              "2013": {
                Settled: 1,
              },
              "2021": {
                Withdrawn: 1,
              },
            },
          },
        },
        {
          id: 37202,
          name: "Rich May, PC",
          slug: "law-firm-rich-may-pc",
          type: "Law Firm",
          created_at: "2019-08-08T17:54:12.483+00:00",
          updated_at: "2019-08-08T17:54:12.483+00:00",
          aggregate_data: {
            types: {
              "2018": {
                Employment: 1,
              },
            },
            dispositions: {
              "2018": {
                Settled: 1,
              },
            },
          },
        },
      ],
      attorneys: null,
      case_count: 2,
      created_at: "2017-02-08T23:57:50.369+00:00",
      updated_at: "2017-02-08T23:57:50.369+00:00",
      aggregate_data: {
        types: {
          "2013": {
            Consumer: 1,
          },
          "2018": {
            Employment: 1,
          },
        },
        dispositions: {
          "2013": {
            Settled: 1,
          },
          "2018": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 1373,
    slug: "law-firm-law-office-of-donald-williford",
    index: "Law Firm Law Office of Donald Williford",
    document: {
      id: 1373,
      name: "Law Office of Donald Williford",
      slug: "law-firm-law-office-of-donald-williford",
      type: "Law Firm",
      firms: null,
      attorneys: [
        {
          id: 1372,
          name: "Donald Williford",
          slug: "attorney-donald-williford",
          type: "Attorney",
          created_at: "2017-02-08T23:52:46.807+00:00",
          updated_at: "2017-02-08T23:52:46.807+00:00",
          aggregate_data: {
            types: {
              "2012": {
                Employment: 1,
              },
            },
            dispositions: {
              "2012": {
                Settled: 1,
              },
            },
          },
        },
      ],
      case_count: 1,
      created_at: "2017-02-08T23:52:46.816+00:00",
      updated_at: "2017-02-08T23:52:46.816+00:00",
      aggregate_data: {
        types: {
          "2012": {
            Employment: 1,
          },
        },
        dispositions: {
          "2012": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 32429,
    slug: "non-consumer-platinum-auto-llc",
    index: "Non Consumer Platinum Auto, LLC",
    document: {
      id: 32429,
      name: "Platinum Auto, LLC",
      slug: "non-consumer-platinum-auto-llc",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2018-02-26T20:15:29.616+00:00",
      updated_at: "2018-02-26T20:15:29.616+00:00",
      aggregate_data: {
        types: {
          "2017": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2017": {
            Settled: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 34235,
    slug: "non-consumer-the-source-auto-group-llc",
    index: "Non Consumer The Source Auto Group, LLC",
    document: {
      id: 34235,
      name: "The Source Auto Group, LLC",
      slug: "non-consumer-the-source-auto-group-llc",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2018-04-12T17:27:12.835+00:00",
      updated_at: "2018-04-12T17:27:12.835+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        awards: {
          "2018": {
            Business: 1,
          },
        },
        dispositions: {
          "2018": {
            Awarded: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 33685,
    slug: "non-consumer-martino-commercial-tire-llc",
    index: "Non Consumer Martino Commercial Tire, LLC",
    document: {
      id: 33685,
      name: "Martino Commercial Tire, LLC",
      slug: "non-consumer-martino-commercial-tire-llc",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2018-02-26T20:40:57.275+00:00",
      updated_at: "2018-02-26T20:40:57.275+00:00",
      aggregate_data: {
        types: {
          "2017": {
            Employment: 1,
          },
        },
        dispositions: {
          "2017": {
            Withdrawn: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 15805,
    slug: "law-firm-coddington-hicks-danforth",
    index: "Law Firm Coddington Hicks & Danforth",
    document: {
      id: 15805,
      name: "Coddington Hicks & Danforth",
      slug: "law-firm-coddington-hicks-danforth",
      type: "Law Firm",
      firms: null,
      attorneys: [
        {
          id: 15804,
          name: "Lee Danforth",
          slug: "attorney-lee-danforth",
          type: "Attorney",
          created_at: "2017-02-09T00:01:12.658+00:00",
          updated_at: "2017-02-09T00:01:12.658+00:00",
          aggregate_data: {
            types: {
              "2012": {
                Consumer: 2,
              },
            },
            dispositions: {
              "2012": {
                Settled: 2,
              },
            },
          },
        },
      ],
      case_count: 2,
      created_at: "2017-02-09T00:01:12.672+00:00",
      updated_at: "2017-02-09T00:01:12.672+00:00",
      aggregate_data: {
        types: {
          "2012": {
            Consumer: 2,
          },
        },
        dispositions: {
          "2012": {
            Settled: 2,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 37974,
    slug: "non-consumer-siamaks-car-company",
    index: "Non Consumer Siamak's Car Company",
    document: {
      id: 37974,
      name: "Siamak's Car Company",
      slug: "non-consumer-siamaks-car-company",
      type: "Non Consumer",
      firms: null,
      attorneys: null,
      case_count: 1,
      created_at: "2019-08-08T18:05:20.355+00:00",
      updated_at: "2019-08-08T18:05:20.355+00:00",
      aggregate_data: {
        types: {
          "2018": {
            Consumer: 1,
          },
        },
        dispositions: {
          "2018": {
            Withdrawn: 1,
          },
        },
      },
    },
  },
  {
    type: "party",
    id: 52364,
    slug: "law-firm-brennan-manna-diamond-llc",
    index: "Law Firm Brennan, Manna & Diamond, LLC",
    document: {
      id: 52364,
      name: "Brennan, Manna & Diamond, LLC",
      slug: "law-firm-brennan-manna-diamond-llc",
      type: "Law Firm",
      firms: null,
      attorneys: [
        {
          id: 52363,
          name: "John Childs",
          slug: "attorney-john-childs",
          type: "Attorney",
          created_at: "2021-09-01T23:29:12.081+00:00",
          updated_at: "2021-09-01T23:29:12.081+00:00",
          aggregate_data: {
            types: {
              "2020": {
                Employment: 1,
              },
            },
            dispositions: {
              "2020": {
                Settled: 1,
              },
            },
          },
        },
      ],
      case_count: 1,
      created_at: "2021-09-01T23:29:12.102+00:00",
      updated_at: "2021-09-01T23:29:12.102+00:00",
      aggregate_data: {
        types: {
          "2020": {
            Employment: 1,
          },
        },
        dispositions: {
          "2020": {
            Settled: 1,
          },
        },
      },
    },
  },
];
