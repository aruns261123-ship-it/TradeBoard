import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function run() {
  await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';`;
  console.log("Column 'status' added to 'applications' successfully!");
  await sql.end();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
