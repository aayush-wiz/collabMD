<!-- 9bab0f40-8e5e-473d-b361-6d15f6e5ac01 ed110ced-7eaf-44a2-8e40-51642f0ecc0c -->
# Auth and Theme System Implementation

## 1. Backend - Fix CORS and Update Schema

### Update Prisma Schema

Add `LastOpenedDocument` model to track which document each user last opened:

- Add relation between User and Document models (make userId required)
- Create LastOpenedDocument model with userId, documentId, and timestamp
- Run migration

### Fix CORS Policy

Create or update `apps/backend/next.config.js` to add CORS headers allowing frontend origin (localhost:3000)

### Install NextAuth Backend Dependencies

- `npm install next-auth@beta bcryptjs`
- `npm install -D @types/bcryptjs`

### Create Auth API Routes

- Create `/api/auth/[...nextauth]/route.ts` for NextAuth
- Configure credentials provider with bcrypt password hashing
- Set up JWT and session configuration
- Create `/api/auth/register/route.ts` for user registration

### Update Document Endpoints

- Modify GET /api/documents to filter by authenticated userId
- Modify POST /api/documents to associate with authenticated userId
- Update PUT/DELETE /api/documents/[id] to verify ownership
- Add authentication middleware checks

### Create Last Opened Document Endpoint

- Create `/api/documents/[id]/last-opened/route.ts` to track last opened document

## 2. Frontend - Theme Provider

### Create Theme Provider

Create `apps/frontend/providers/theme-provider.tsx`:

- Extract theme logic from EditorContext
- Provide theme state globally
- Persist theme in localStorage

### Update EditorContext

- Remove theme state and setTheme
- Import and use theme from ThemeProvider instead

### Update Root Layout

- Wrap app with ThemeProvider
- Apply theme class to body/html element

### Update Components

- Update WorkspaceHeader to use ThemeProvider
- Update any other components referencing theme from EditorContext

## 3. Frontend - Authentication

### Install NextAuth Frontend Dependencies

- `npm install next-auth@beta`

### Create Auth Pages

- Create `apps/frontend/app/login/page.tsx` with email/password form
- Create `apps/frontend/app/register/page.tsx` with registration form
- Style forms to match app theme (dark/light mode support)

### Configure NextAuth Client

- Create `apps/frontend/lib/auth.ts` for NextAuth configuration
- Create auth utility functions

### Add Authentication Middleware

- Create `apps/frontend/middleware.ts` to protect all routes except login/register
- Redirect unauthenticated users to /login

### Update API Calls

- Create API client utility with auth token/cookie handling
- Update all document fetching calls to include authentication
- Handle 401 errors and redirect to login

### Track Last Opened Document

- Update editor page to call last-opened endpoint when document loads
- Store last opened document ID in state/context if needed

## Key Files to Create/Modify

**Backend:**

- `apps/backend/prisma/schema.prisma`
- `apps/backend/next.config.js`
- `apps/backend/app/api/auth/[...nextauth]/route.ts`
- `apps/backend/app/api/auth/register/route.ts`
- `apps/backend/app/api/documents/route.ts`
- `apps/backend/app/api/documents/[id]/route.ts`
- `apps/backend/app/api/documents/[id]/last-opened/route.ts`

**Frontend:**

- `apps/frontend/providers/theme-provider.tsx`
- `apps/frontend/app/layout.tsx`
- `apps/frontend/app/login/page.tsx`
- `apps/frontend/app/register/page.tsx`
- `apps/frontend/middleware.ts`
- `apps/frontend/lib/api-client.ts`
- `apps/frontend/components/editor/editor-context.tsx`
- `apps/frontend/components/workspace/workspace-header.tsx`
- All files with API fetch calls

### To-dos

- [ ] Update Prisma schema with LastOpenedDocument model and make userId required in Document
- [ ] Add CORS headers to backend next.config.js
- [ ] Install NextAuth and bcryptjs packages in backend
- [ ] Create NextAuth API route with credentials provider
- [ ] Create registration API endpoint with password hashing
- [ ] Update document endpoints to filter by userId and verify ownership
- [ ] Create last opened document tracking endpoint
- [ ] Run Prisma migration for auth schema changes
- [ ] Create ThemeProvider component with localStorage persistence
- [ ] Remove theme from EditorContext and use ThemeProvider
- [ ] Wrap app with ThemeProvider in root layout
- [ ] Install NextAuth in frontend
- [ ] Create login page with email/password form
- [ ] Create register page with registration form
- [ ] Create middleware to protect routes and redirect to login
- [ ] Create API client utility with authentication handling
- [ ] Update all API fetch calls to use authenticated API client
- [ ] Track last opened document in editor page