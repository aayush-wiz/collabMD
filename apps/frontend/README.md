## CollabMD Frontend

Next.js 16 application styled with Tailwind CSS. This app lives at `apps/frontend` inside the Turborepo.

### Getting Started

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

- `app/` – App Router pages, layouts, and server components.
- `app/page.tsx` – Markdown editor workspace with live preview and layout toggles.
- `app/globals.css` – Tailwind entry point.
- `app/editor/*` – Editor routes (new document and by id).
- `components/` – CollabMD UI building blocks (editor panes, toolbars, etc).
- `public/` – Icons and assets used by the editor and navbar.
- `tailwind.config.ts` – Tailwind setup scanning shared UI components.

### Features

- Split/preview/editor layout toggles in the navbar.
- GitHub-flavored markdown rendering (tables, task lists, code blocks).
- Toolbar actions for common markdown formatting.
- Download/export modal for saving content.

### Styling

Tailwind is configured with Geist fonts and supports shared components from `@repo/ui`. To customize the theme, edit `tailwind.config.ts`.

### Deployment

Deploy to any Next.js-compatible platform (Vercel, etc.). Ensure environment variables (if introduced later) are configured in your hosting provider prior to build.
