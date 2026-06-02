import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Add it to .env.local');
}

// postgres.js client — compatible with Supabase Transaction Pooler (port 6543)
// and Direct connection (port 5432) for migrations
const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
