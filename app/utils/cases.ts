// @ts-expect-error: We need to polyfill this
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export function first<T>(v: T[]): T | undefined {
  return v[0];
}

export const days = (date: number) => Math.floor(date / 1000 / 60 / 60 / 24);
export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { timeZone: "UTC" });

export enum PartyType {
  Consumer = "Consumer",
  NonConsumer = "Non Consumer",
}

export const partyType = (initiatingParty?: string | null) => {
  switch (initiatingParty) {
    case "Non Consumer":
    case "Business":
      return PartyType.NonConsumer;

    case "Consumer":
    case "Employee":
    case "Home Owner":
      return PartyType.Consumer;
  }
};

export const CONSUMER_PARTY = { name: "Consumer", type: "Consumer" };
