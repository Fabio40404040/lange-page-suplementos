import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error("O banco de produtos não está disponível.");
  }

  return drizzle(env.DB, { schema });
}
