import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main(): Promise<void> {
  const readline = createInterface({ input, output });
  const password = await readline.question("Password: ");
  readline.close();

  if (!password) {
    throw new Error("Password cannot be empty.");
  }

  console.log(await bcrypt.hash(password, 12));
}

main().catch((error: unknown) => {
  console.error("Failed to hash password:", error);
  process.exitCode = 1;
});
