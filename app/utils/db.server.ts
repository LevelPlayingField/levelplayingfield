import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

const db = singleton("prisma", () => {
  if (process.env.NODE_ENV === "development") {
    const client = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
    client.$on("query", (e) => {
      console.log("Query: " + e.query);
      console.log("Params: " + e.params);
      console.log("Duration: " + e.duration + "ms");
    });
    return client;
  }

  return new PrismaClient();
});

export default db;
