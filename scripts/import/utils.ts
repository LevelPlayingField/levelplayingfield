export const NA = new Set(["na", "n/a", "nan", "unknown", "none", "null", "undefined"]);

export const nonNaN = (v: any) => (isNaN(v) ? null : v);

export const nullOr = (c: (v: any) => any) => (v: any) => v == null || String(v).trim() === "" ? null : c(v);

export const date = (v: any) => new Date(v);

export const integer = (v: any) => parseInt(v, 10);

export const decimal = (v: any) => parseFloat(v);

export const rtrim = (c) => (v) => v.replace(new RegExp(`${c}+$`), "");

export const ltrim = (c) => (v) => v.replace(new RegExp(`^${c}+`), "");

export const rsplit = (v: string | null | undefined, c: string) => {
  if (v == null) {
    return null;
  }

  const parts = v.split(c);
  const right = parts.pop();
  return [parts.join(c), right];
};

export const cleanStr = (str) => String(str).replace(/\s+/, " ").trim();

export const lookupValue = (table: Record<string, string>) => (str: string) => table[str];

export const naOr = (str: string, v: string | null | undefined = null) => (NA.has(String(str).toLowerCase()) ? v : str);

export const percent = (v) => (typeof v === "string" ? decimal(rtrim("%")(v)) : decimal(v));

export const bool = (v) => ["true", "t", "yes", "y"].indexOf(v.toString().toLowerCase()) !== -1;

export const money = (v) => {
  let dec;

  if (typeof v === "string") {
    dec = decimal(ltrim("\\$")(v).replace(",", ""));
  } else {
    dec = decimal(v);
  }

  return Math.floor(dec * 100);
};

export const fixName = (name: string): string => {
  switch (cleanStr(name)) {
    case "AT&T*":
      return "AT&T";

    default:
      return cleanStr(name);
  }
};

export function isInvalidData(v) {
  return (
    ["na", "n/a", "nan", "none", "unknown"].indexOf(String(v).toLowerCase()) !== -1 ||
    (typeof v === "number" && isNaN(v))
  );
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function buildUniqueValue(caseNumber: string, ...partyNames: Array<string | null | undefined>) {
  return [caseNumber, ...partyNames.filter((v) => v != null).map(nullOr(slugify))].join(",");
}

export function validateCaseData(caseData: Record<string, any>) {
    const errors = [];
  
    for (const k of Object.keys(caseData)) {
      if (isInvalidData(caseData[k])) {
        errors.push(`caseData["${k}"] -> "${caseData[k]}" is invalid`);
      }
    }
  
    if (errors.length) {
      throw new Error(`Validation Error on caseData\n${errors.join('\n')}`);
    }
  }