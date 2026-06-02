import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // DIRECT_URL is used here — the pooler URL doesn't support DDL for migrations
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
} satisfies Config;
