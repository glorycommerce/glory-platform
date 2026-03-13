import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const pnpmRoot = join(projectRoot, "node_modules", ".pnpm");

const prismaClientPackageDir = readdirSync(pnpmRoot)
  .filter((name) => name.startsWith("@prisma+client@"))
  .map((name) => join(pnpmRoot, name, "node_modules", "@prisma", "client"))
  .find((dir) => existsSync(dir));

if (!prismaClientPackageDir) {
  console.warn("[prisma-link-client] Could not locate @prisma/client package directory.");
  process.exit(0);
}

const generatedSource = join(prismaClientPackageDir, "..", "..", ".prisma", "client");
const generatedTarget = join(prismaClientPackageDir, ".prisma", "client");

if (!existsSync(generatedSource)) {
  console.warn(
    `[prisma-link-client] Source not found: ${generatedSource}. Run "pnpm db:generate" first.`
  );
  process.exit(0);
}

mkdirSync(generatedTarget, { recursive: true });
cpSync(generatedSource, generatedTarget, { recursive: true, force: true });
console.log(`[prisma-link-client] Synced Prisma client runtime artifacts to ${generatedTarget}`);
