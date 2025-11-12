## CollabMD Frontend

Next.js 16 application styled with Tailwind CSS. This app lives inside the Turborepo at `apps/frontend`.

### Available Scripts

```bash
npm run dev            # next dev --port 3000
npm run build          # next build
npm run start          # next start
npm run lint           # eslint --max-warnings 0
npm run check-types    # next typegen && tsc --noEmit
```

Run scripts through the workspace:

```bash
npm run dev --workspace frontend
```

### Directory Highlights

- `app/` – App Router pages, layouts, and server components.
- `app/page.tsx` – Markdown editor workspace with live preview and layout toggles.
- `app/globals.css` – Tailwind entry point.
- `tailwind.config.ts` – Tailwind setup scanning shared UI components.
- `components/` – Place collab-specific UI building blocks here.

### Styling

Tailwind is configured with the shared Geist font variables. Update `tailwind.config.ts` to add custom theme tokens. Shared components from `@repo/ui` are Tailwind-ready out of the box.

### Data Fetching

Use the backend API (`apps/backend`) for data access or interact directly with future shared packages. Server Components can call `fetch` or integrate with React Server Actions as needed.

### Markdown Editor

The root page now ships a HackMD-style experience:

- Edit markdown in the left pane and see a live preview rendered with GitHub-flavored markdown.
- Use the navbar to switch between **Split Pane**, **Preview Only**, and **Editor Only** layouts.
- Tables, task lists, and code blocks are supported out of the box.

#### Manual QA

```bash
npm run dev --workspace frontend
```

1. Open `http://localhost:3000`.
2. Toggle each layout option and confirm the panes show/hide correctly.
3. Update text in the editor and verify the preview updates instantly.
4. Paste a table, checklist, and fenced code block to confirm formatting.
5. Resize the window to ensure the layout stacks gracefully on smaller screens.

### Deployment

Deploy to any Next.js compatible platform. Ensure the backend services and API routes are deployed alongside this app or proxied appropriately. Configure environment variables in your hosting provider before building.
