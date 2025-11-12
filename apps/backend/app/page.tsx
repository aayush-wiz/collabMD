import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export const revalidate = 0;

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.BACKEND_BASE_URL) {
    return process.env.BACKEND_BASE_URL;
  }

  return "http://localhost:3001";
};

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${getBaseUrl()}/api/users`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { users: User[] };
  return payload.users ?? [];
}

export default async function Home() {
  const users = await fetchUsers();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-16 md:px-10 lg:py-24">
          <header className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              API backend
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
              Next.js API routes backed by Prisma & Neon Postgres
            </h1>
            <p className="max-w-2xl text-base text-slate-300 md:text-lg">
              The backend app exposes typed API routes using Prisma as the ORM.
              Update the database schema in{" "}
              <code className="rounded bg-midnight-900/60 px-2 py-1 font-mono text-sm text-cyan-200">
                apps/backend/prisma/schema.prisma
              </code>{" "}
              and regenerate the client to keep everything in sync.
            </p>
          </header>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  Latest users
                </h2>
                <p className="text-sm text-slate-300">
                  Data served by <code className="font-mono text-cyan-200">GET /api/users</code>.
                </p>
              </div>
              <Link
                href="/api/users"
                className="inline-flex h-10 items-center justify-center rounded-full border border-cyan-300/60 px-5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                View response
              </Link>
            </div>

            <div className="grid gap-4">
              {users.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                  No users found yet. Run{" "}
                  <code className="font-mono text-cyan-200">
                    npm run db:push --workspace backend
                  </code>{" "}
                  after configuring your database or create records through the
                  API.
                </div>
              ) : (
                users.map((user) => (
                  <article
                    key={user.id}
                    className="rounded-xl border border-white/10 bg-midnight-900/70 p-6 transition hover:border-cyan-200/60 hover:bg-midnight-900/90"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {user.name ?? "Unnamed user"}
                    </h3>
                    <p className="text-sm text-cyan-100">{user.email}</p>
                    <dl className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                      <div>
                        <dt className="uppercase tracking-wide text-slate-500">
                          Created
                        </dt>
                        <dd>{new Date(user.createdAt).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wide text-slate-500">
                          Updated
                        </dt>
                        <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
                      </div>
                    </dl>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
