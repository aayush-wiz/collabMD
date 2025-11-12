# CollabMD Monorepo

Turborepo-powered workspace for the CollabMD project. It contains a pair of [Next.js](https://nextjs.org/) applications (frontend UI + backend API) and shared packages configured with Tailwind CSS, TypeScript, Prisma, and Postgres (Neon).

## Apps

- `apps/frontend`: public-facing Next.js application styled with Tailwind.
- `apps/backend`: Next.js application that exposes API routes backed by Prisma and Neon Postgres.

## Packages

- `@repo/ui`: shared React component library (Tailwind-friendly).
- `@repo/eslint-config`: shared ESLint configuration.
- `@repo/typescript-config`: shared TypeScript configuration.

## Quick Start

```bash
# Install dependencies
npm install

# Copy the backend env template and add your Neon connection string
cp apps/backend/.env.example apps/backend/.env

# Apply the Prisma schema to your Neon database
npm run db:push

# Start both apps
npm run dev
```

Open http://localhost:3000 for the frontend and http://localhost:3001 for the backend/API.

## Managing Environments

- `DATABASE_URL`: Neon Postgres connection string (required by Prisma in `apps/backend`).
- `BACKEND_BASE_URL`: optional base URL for server-side API calls (defaults to `http://localhost:3001`).

> Environment variables should live in `apps/backend/.env`. The template `apps/backend/.env.example` shows the expected shape.

## Workspace Scripts

```bash
npm run dev             # turbo run dev for all apps
npm run dev:frontend    # next dev --port 3000 (frontend)
npm run dev:backend     # next dev --port 3001 (backend)
npm run build           # turbo run build
npm run lint            # turbo run lint
npm run check-types     # turbo run check-types
npm run db:generate     # prisma generate (backend)
npm run db:push         # prisma db push (backend)
npm run db:migrate      # prisma migrate dev (backend)
```

The monorepo uses [Turborepo pipelines](./turbo.json) so task outputs are cached automatically. See `package.json` for the complete script list.

## Database & Prisma

Schema lives in `apps/backend/prisma/schema.prisma`. Update it, then regenerate the client:

```bash
npm run db:generate
```

To apply schema changes to Neon:

```bash
npm run db:push
```

Or create versioned migrations:

```bash
npm run db:migrate
```

## Project Structure

```
apps/
  frontend/   # Public UI (Next.js + Tailwind)
  backend/    # API routes + Prisma integration
packages/
  ui/                 # Shared component library
  eslint-config/      # ESLint flat config
  typescript-config/  # Shared tsconfig presets
turbo.json            # Turborepo pipeline config
```

## Remote Caching (Optional)

Authenticate Turbo with Vercel to unlock remote caching:

```bash
npx turbo login
npx turbo link
```

This speeds up builds in CI and across team members.
