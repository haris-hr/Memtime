# Memtime Task

A Vue 3 + TypeScript app for managing time entries with a hierarchical view of clients, projects, and tasks.

## Quick Start

```bash
npm install
cp .env.example .env   # Add your API credentials
```

### For Local Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Your API key will be visible in the browser (fine for local dev).

### For Production (Secure)

```bash
vercel dev
```

Opens at `http://localhost:3000`. Uses a proxy so your API key stays hidden.

When deploying to Vercel, set these in your dashboard:
- `API_BASE_URL` - Your API endpoint
- `API_KEY` - Your bearer token
- `VITE_USE_PROXY=true` - Tells the app to use the proxy

## Features

- **Hierarchy View** — Browse clients → projects → tasks in an expandable tree
- **Time Entries** — List, create, edit, and delete time entries
- **Form Validation** — Duration preview, error handling, double-submit prevention
- **Fully Responsive** — Mobile-first design that works seamlessly on all screen sizes

## Project Structure

```
src/
├── api/           # API client and services
├── components/    # Reusable UI components
├── views/         # Page components
├── composables/   # Shared logic
├── config/        # Constants and messages
└── types/         # TypeScript interfaces

api/
└── proxy.ts       # Vercel serverless proxy (keeps API key hidden)
```

## Tech Stack

- Vue 3 + Composition API
- TypeScript
- Vue Router
- Axios
- Vite
- Vercel Serverless Functions

## Notes

- **Rate limiting** — API allows 15 req/min. The app uses lazy loading to stay under limits.
- **Pagination** — Fetches `pageSize + 1` to detect if there's a next page (API doesn't return total count).

**Known API Issues**
- Deleting the last time entry causes a 500 error when fetching the empty list
- Creating a time entry with an invalid task ID returns 404, but updating allows any task ID without validation (we could make Task ID read-only on the frontend, but users may want to reassign time to a different task)

## Security

- API key can be kept server-side using the Vercel proxy
- CSRF-safe (Bearer tokens aren't auto-sent by browsers)
- XSS-safe (Vue escapes output by default)

## Future Improvements

**UX Enhancements**
- Time log dashboard — View time entries grouped by task or by day, client or by project, with totals and summaries
- Task time summary — Display total logged time inside each task node in the Overview
- Task picker modal — Browse hierarchy and select tasks with search instead of typing IDs manually
- Time entries search — Add datepicker and filters to search entries by date range
- Hierarchy overview search — Add search bar to Overview to quickly find clients, projects, or tasks
- Dark mode — Theme toggle
- Optimistic updates — Update UI immediately while waiting for API

**Performance**
- API response caching — Use `@tanstack/vue-query` or in-memory cache for hierarchy data
- Date memoization — Cache formatted dates to avoid repeated `Date` object creation

**Architecture**
- State management — Integrate Pinia if the app grows
- Error boundary — Catch unexpected errors and prevent full app crashes
- CSS modules — Better style scoping and organization
- Tests — Add Vitest + Vue Test Utils

---

Built for Memtime interview task.
