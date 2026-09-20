import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";

/**
 * Change any account's password against the configured DATABASE_URL.
 * Usage: npm run set-password -- <email> <new-password>
 */
async function main() {
  const [emailArg, newPassword] = process.argv.slice(2);
  if (!emailArg || !newPassword) {
    console.error("Usage: npm run set-password -- <email> <new-password>");
    process.exit(1);
  }
  if (newPassword.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const updated = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.email, email))
    .returning({ id: users.id, email: users.email });

  if (updated.length === 0) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }
  console.log(`Password updated for ${updated[0].email} (user #${updated[0].id})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$client.end();
  });
