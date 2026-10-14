import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Database connection is not configured. Set DATABASE_URL or POSTGRES_URL.",
  );
}

const sql = neon(connectionString);

export const db = drizzle({ client: sql });
