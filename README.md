# CollabMD

Turborepo-powered monorepo for the CollabMD project. It currently includes a single [Next.js](https://nextjs.org/) application for the frontend, plus shared packages for UI and tooling.

## Apps

- `apps/frontend`: Public-facing Next.js 16 application styled with Tailwind CSS.

## Packages

- `@repo/ui`: Shared React component library (Tailwind-friendly).
- `@repo/eslint-config`: Shared ESLint configuration.
- `@repo/typescript-config`: Shared TypeScript configuration.

## Requirements

- Node.js >= 18
- npm (workspace-enabled; this repo uses npm workspaces)

## Quick Start

```bash
# Install dependencies for the entire workspace
npm install

# Start the frontend app (port 3000)
npm run dev
```

Open `http://localhost:3000` to view the app.

## Workspace Scripts

From the repository root:

```bash
npm run dev             # turbo run dev --filter=frontend
npm run build           # turbo run build --filter=frontend
npm run lint            # turbo run lint --filter=frontend
npm run check-types     # turbo run check-types --filter=frontend
npm run format          # prettier --write \"**/*.{ts,tsx,md}\"

# Alternatively, target the workspace explicitly
npm run dev --workspace frontend
```

The monorepo uses [Turborepo pipelines](./turbo.json) for fast, cached builds and a persistent dev server task.

## Project Structure

```
apps/
  frontend/            # Public UI (Next.js + Tailwind)
packages/
  ui/                  # Shared component library
  eslint-config/       # ESLint flat config
  typescript-config/   # Shared tsconfig presets
turbo.json             # Turborepo pipeline config
```

## Tech Stack

- Next.js 16, React 19
- Tailwind CSS
- Turborepo
- TypeScript

## Remote Caching (optional)

Authenticate Turbo with Vercel to enable remote caching:

```bash
npx turbo login
npx turbo link
```

This speeds up builds in CI and across team members.
