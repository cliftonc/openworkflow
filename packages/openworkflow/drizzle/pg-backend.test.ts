import { DEFAULT_POSTGRES_URL } from "../postgres/postgres.js";
import { testBackend } from "../testing/backend.testsuite.js";
import { BackendDrizzlePg } from "./pg-backend.js";
import { createPgSchema } from "./schema.testsuite.js";
import { createPgTables } from "./tables.js";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { afterAll, describe } from "vitest";

describe.each(["", "ow_"])(
  'BackendDrizzlePg (postgres.js, prefix: "%s")',
  (prefix) => {
    const schema = `openworkflow_drizzle_${randomUUID().replaceAll("-", "")}`;
    const client = postgres(DEFAULT_POSTGRES_URL, { onnotice: ignoreNotice });
    const db = drizzle({ client });
    const tables = createPgTables({ prefix, schema });
    const schemaReady = createPgSchema(db, tables);

    afterAll(async () => {
      await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`));
      await client.end();
    });

    testBackend({
      setup: async () => {
        await schemaReady;
        return new BackendDrizzlePg({
          db,
          tables,
          namespaceId: randomUUID(),
        });
      },
      teardown: async (backend) => {
        await backend.stop();
      },
    });
  },
);

/** Drop server notices, e.g. from DROP SCHEMA ... CASCADE. */
function ignoreNotice(): void {
  // notices are expected during cleanup
}
