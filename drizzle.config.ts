import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
