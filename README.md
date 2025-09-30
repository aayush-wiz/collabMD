# Collaborative Markdown Editor Backend

This is the backend for a collaborative markdown editor built with Hono (web framework), Bun (runtime), Drizzle ORM (database interactions), and Neon (Postgres database). It supports user authentication with JWT stored in cookies, and is structured in a modular way for maintainability. The app is currently focused on auth endpoints (register/login), with plans for document CRUD and real-time collaboration via WebSocket.

## Tech Stack
- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Hono (lightweight web framework for edge runtimes)
- **Database**: Neon (serverless Postgres)
- **ORM**: Drizzle ORM (TypeScript-first ORM for Postgres)
- **Validation**: Zod (schema validation)
- **Auth**: bcryptjs (password hashing), jsonwebtoken (JWT)
- **Other**: @hono/zod-validator (for request validation), hono/cookie (built-in for cookie handling)


