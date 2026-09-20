/**
 * Dev-only helper: runs a real Postgres without Docker or a system install.
 *   node scripts/dev-db.mjs start   → initialize (first run) + start on :5432
 *   node scripts/dev-db.mjs stop    → stop the database
 */
import EmbeddedPostgres from "embedded-postgres";

const dataDir = process.env.PGDATA_DIR ?? ".pgdata";

async function main() {
  const command = process.argv[2] ?? "start";

  if (command === "stop") {
    const pg = new EmbeddedPostgres({
      databaseDir: dataDir,
      user: "tradeboard",
      password: "tradeboard",
      persistence: true,
    });
    await pg.stop();
    console.log("Postgres stopped.");
    return;
  }

  const fs = await import("node:fs");
  const firstRun = !fs.existsSync(dataDir);

  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: "tradeboard",
    password: "tradeboard",
    persistence: true,
    port: 5432,
  });

  if (firstRun) {
    console.log("Initializing Postgres data dir…");
    await pg.initialise();
  }

  try {
    await pg.start();
  } catch (err) {
    if (String(err).includes("lock")) {
      console.log("Postgres appears to already be running.");
      return;
    }
    throw err;
  }

  if (firstRun) {
    await pg.createDatabase("tradeboard");
    console.log("Created database tradeboard");
  }

  console.log("Postgres running on localhost:5432 (tradeboard/tradeboard)");
  console.log("Keep this window/process open, then run: npm run db:push && npm run db:seed");

  // Stay alive; Ctrl+C to stop.
  setInterval(() => {}, 1 << 30);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
