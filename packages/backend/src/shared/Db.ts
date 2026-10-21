import { InjectionToken } from "@needle-di/core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;
export type DrizzleDb = PostgresJsDatabase;

export const DB_SQL = new InjectionToken<Sql>("DB_SQL");
export const DB = new InjectionToken<DrizzleDb>("DB");
