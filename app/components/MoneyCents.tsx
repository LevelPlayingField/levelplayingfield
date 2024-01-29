const numberFormat = Intl.NumberFormat(undefined, { currency: "USD", style: "currency" });

export default function MoneyCents({ value, whenNull }: { value?: number | string | null; whenNull?: string }) {
  if (value == null) {
    if (whenNull) {
      return <div>{whenNull}</div>;
    } else {
      return null;
    }
  }

  return <div>{numberFormat.format((typeof value === "string" ? parseInt(value) : value) / 100)}</div>;
}
