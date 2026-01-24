# CollabMD Frontend

Next.js 16 application styled with Tailwind CSS. This app lives at `apps/frontend` inside the Turborepo.

## Getting Started

From the repository root:

```bash
npm install
npm run dev --workspace frontend
```

Or run directly inside this folder if your package manager is workspace-aware:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Available Scripts

```bash
npm run dev            # next dev --port 3000
npm run build          # next build
npm run start          # next start
npm run lint           # eslint --max-warnings 0
npm run check-types    # next typegen && tsc --noEmit
```

You can also invoke these from the root with:

```bash
npm run dev --workspace frontend
```

### Directory Highlights

#### Team 3 (Frontend Integration & Features)

- `app/` – App Router pages, layouts, and routing (Team 3)
  - `app/(auth)/` – Sign-in and sign-up pages
  - `app/workspace/` – Document workspace page
  - `app/editor/` – Editor page routes (new document and by id)
  - `app/page.tsx` – Home page redirect
  - `app/globals.css` – Tailwind entry point
- `components/workspace/` – Workspace UI components (document cards, header, GitHub import)
- `providers/` – Authentication and theme context providers
- `lib/` – API client, utilities, and configuration
- `tailwind.config.ts` – Tailwind setup scanning shared UI components

#### Team 2 (Frontend Core & Editor)

- `components/editor/` – Core editor components (Team 2)
  - `editor-pane.tsx` – CodeMirror markdown editor
  - `preview-pane.tsx` – Live markdown preview
  - `editor-toolbar.tsx` – Formatting toolbar
  - `markdown-components.tsx` – Custom markdown renderers
  - `editor-context.tsx` – Editor state management
  - `editor-navbar.tsx` – Editor navigation and controls
  - `download-modal.tsx` – PDF export functionality
  - `workspace.tsx` – Editor layout component

#### Shared

- `public/` – Icons and assets used by the editor and navbar
- `components/ui/` – Reusable UI components

### Features

#### Editor Features (Team 2)

- Split/preview/editor layout toggles in the navbar
- GitHub-flavored markdown rendering (tables, task lists, code blocks)
- Toolbar actions for common markdown formatting
- Auto-save functionality with debouncing
- PDF export modal for saving content
- Real-time markdown preview with syntax highlighting

#### Application Features (Team 3)

- User authentication (sign-in/sign-up pages)
- Document workspace with listing and management
- GitHub repository import functionality
- Theme switching (dark/light mode)
- Protected routes and session management
- Responsive design across all pages

### Styling

Tailwind is configured with Geist fonts and supports shared components from `@repo/ui`. To customize the theme, edit `tailwind.config.ts`.

### Deployment

Deploy to any Next.js-compatible platform (Vercel, etc.). Ensure environment variables (if introduced later) are configured in your hosting provider prior to build.
