import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema> & { $client: postgres.Sql };

const connectionString = process.env.DATABASE_URL;

let instance: Db | undefined;

function getDb(): Db {
  if (!instance) {
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set - add it to .env locally or to your Vercel project's Environment Variables."
      );
    }
    // prepare:false for serverless compatibility (Neon/Vercel)
    instance = drizzle(postgres(connectionString, { prepare: false }), {
      schema,
    }) as Db;
  }
  return instance;
}

/**
 * Lazy database handle: nothing connects at import time, and a missing
 * DATABASE_URL fails with a clear error on first *query* instead of
 * crashing every page at module load.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = real[prop as keyof Db];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(real)
      : value;
  },
});

export { schema };
