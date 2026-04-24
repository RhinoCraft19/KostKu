import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // DATABASE_URL uses PgBouncer (pooled) for runtime queries
    url: process.env.DATABASE_URL || "",
    // DIRECT_URL uses direct connection for migrations & schema push
    directUrl: process.env.DIRECT_URL,
  },
  migrations: {
    path: "prisma/migrations",
  },
});
