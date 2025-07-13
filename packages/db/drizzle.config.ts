import { type Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL ?? "",
    ssl: {
      rejectUnauthorized: false, // Required for Supabase pooler
    },
  },
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
