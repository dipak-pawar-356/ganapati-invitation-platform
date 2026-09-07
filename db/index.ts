import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "postgresql://neondb_owner:npg_LneXBY6h5wgo@ep-tiny-scene-azc349u2-pooler.c-3.ap-southeast-1.aws.neon.tech/ganapati-mandal-invitations?sslmode=require&channel_binding=require";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
