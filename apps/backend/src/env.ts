import fs from "fs";
import path from "path";
import dotenv from "dotenv";

function loadIfExists(envPath: string) {
  if (!fs.existsSync(envPath)) return;
  dotenv.config({ path: envPath });
}

/**
 * Monorepo-friendly env loading:
 * - Prefer the package-local env first (apps/backend/.env / .env.local)
 * - Then fall back to repo root env (../../.env / ../../.env.local)
 *
 * dotenv will NOT override already-defined process.env values.
 */
export function loadEnv() {
  const cwd = process.cwd();

  // When running `npm run dev` inside apps/backend, cwd is usually apps/backend.
  loadIfExists(path.resolve(cwd, ".env"));
  loadIfExists(path.resolve(cwd, ".env.local"));

  // When running via turbo from repo root, or if you keep envs at the root.
  loadIfExists(path.resolve(cwd, "../../.env"));
  loadIfExists(path.resolve(cwd, "../../.env.local"));
}

export function requireEnvVars(vars: string[]) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length === 0) return;

  // Keep the error extremely actionable.
  // eslint-disable-next-line no-console
  console.error(
    [
      "",
      "Missing required environment variables:",
      ...missing.map((m) => `- ${m}`),
      "",
      "Create an env file at `apps/backend/.env` (recommended) with at least:",
      'DATABASE_URL="postgresql://username:password@localhost:5432/collabmd"',
      'JWT_SECRET="your-super-secret-jwt-key"',
      'OPENAI_API_KEY="your-openai-api-key"',
      "",
      "See the repo README for full setup instructions.",
      "",
    ].join("\n")
  );

  process.exit(1);
}


