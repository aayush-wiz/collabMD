## CollabMD Backend

Next.js 16 application that exposes API routes powered by Prisma and Neon Postgres. Located at `apps/backend` inside the Turborepo.

### Environment

Copy `.env.example` and provide your Neon connection string:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Required variables:

- `DATABASE_URL` – Neon Postgres connection string (`?sslmode=require` recommended).
- `BACKEND_BASE_URL` – optional base URL for server-side fetches (defaults to `http://localhost:3001`).

### Prisma Workflow

```bash
npm run db:generate --workspace backend   # prisma generate
npm run db:push --workspace backend       # prisma db push
npm run db:migrate --workspace backend    # prisma migrate dev
npm run db:studio --workspace backend     # prisma studio
```

`schema.prisma` lives in `prisma/`. Update it, regenerate the client, then push or migrate as needed.

### API Routes

- `GET /api/users` – returns the most recent users from Prisma.

Add additional routes under `app/api/*/route.ts`. Import the shared Prisma client from `@/lib/prisma`.

### Available Scripts

```bash
npm run dev            # next dev --port 3001
npm run build          # next build
npm run start          # next start
npm run lint           # eslint --max-warnings 0
npm run check-types    # next typegen && tsc --noEmit
```

Run scripts via the workspace helper:

```bash
npm run dev --workspace backend
```

### Deployment

Ensure `DATABASE_URL` is set in your hosting provider before building. If the backend is deployed separately from the frontend, expose the base URL to the frontend app so it can reach the API routes.
