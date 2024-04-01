import z from "zod";
import searchQueryParser from "search-query-parser";

const keywords = ["is", "board", "party", "state", "disposition", "awarded", "type"];
/// Well, need to validate these ourself
const ranges = ["filed", "closed"];

const dirtyArray = (t: z.ZodTypeAny) =>
  z
    .any()
    .array()
    .transform((arr) => arr.map((i) => (t.safeParse(i).success ? i : undefined)).filter(Boolean))
    .pipe(t.array());

export type SearchQuery = z.infer<typeof searchQuery>;
export const searchQuery = z.object({
  is: dirtyArray(z.enum(["case", "party"])).optional(),
  type: dirtyArray(z.enum(["employment", "consumer"])).optional(),
  board: z.string().array().optional(),
  party: z.string().array().optional(),
  state: z.string().array().optional(),
  disposition: z.string().array().optional(),
  awarded: z.string().array().optional(),

  filed: z.object({ from: z.coerce.date(), to: z.coerce.date() }).optional(),
  closed: z.object({ from: z.coerce.date(), to: z.coerce.date() }).optional(),

  text: z.array(z.string()).optional(),
});

export const parse = (queryString: string): SearchQuery =>
  searchQuery.parse(searchQueryParser.parse(queryString, { keywords, ranges, tokenize: true, alwaysArray: true }));

export const stringify = (query: SearchQuery): string =>
  query ? searchQueryParser.stringify(query, { keywords, ranges, tokenize: true, alwaysArray: true }) : "";
