# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

All commands run from the `frontend/` directory using pnpm:

```bash
pnpm dev          # Dev server on port 3001
pnpm build        # TypeScript check + Vite production build
pnpm lint         # ESLint (flat config)
pnpm preview      # Preview production build locally
```

## Domain Context

This is **Удамшил** (Udamshil) — a Mongolian horse pedigree and accounting system. The UI is in Mongolian. Key domain terms used throughout the codebase:

| Mongolian | English | Code term |
|-----------|---------|-----------|
| Адуу | Horse | `aduu` (plural: `aduunuud`) |
| Үүлдэр | Breed | `uulder` |
| Бүлэг | Group/Lineage | `buleg` |
| Амжилт | Achievement (race results) | `amjilt` (plural: `amjiltuud`) |
| Зураг | Photo | `zurag` (plural: `zuragnuud`) |
| Хүйс | Gender (`er`/`em` = stallion/mare) | `huis` |
| Зарлага шалтгаан | Departure reason | `zarlagaShaltgaan` |

## Architecture

**Frontend-only repo** — the backend is a separate HTTPS service (URL kept out of source). The frontend calls the backend directly; no Vercel proxy. `VITE_API_URL` is **required** — set it in `.env` / `.env.local` for local dev (both are gitignored) and as a Vercel project environment variable for production. The app throws on startup if it's missing.

### Provider hierarchy (main.tsx)
`StrictMode` → `QueryClientProvider` (React Query, 1min staleTime) → `ThemeProvider` (Ant Design + dark/light mode) → `App`

### Routing (App.tsx)
- **Public:** `/login`, `/register`, `/forgot-password`, `/verify-email`
- **Protected** (wrapped in `ProtectedRoute` → `MainLayout` with sidebar): `/` (dashboard), `/aduu`, `/aduu/:id`, `/uulder`, `/buleg`, `/amjilt`, `/profile`
- `ProtectedRoute` checks auth token from Zustand store, verifies via `/me` endpoint, and enforces email verification

### API layer (`src/api/`)
- `client.ts` — Axios instance with auth interceptor (reads token from Zustand) and response interceptor (auto-redirects on 401/403). Custom `ApiError` class.
- `types.ts` — All TypeScript interfaces for API requests/responses
- Per-entity modules (`aduu.ts`, `uulder.ts`, `buleg.ts`, `amjilt.ts`, `zurag.ts`, `auth.ts`, `users.ts`, `stats.ts`, `upload.ts`) — each exports React Query hooks and query key factories
- `index.ts` — barrel re-export of all hooks and keys. Import from `../api` not individual files.

**Pattern:** Each API module follows the same structure: raw API functions → query key factory (e.g. `aduuKeys`) → exported React Query hooks (`useQuery`/`useMutation`). Mutations invalidate related query keys on success.

### State management
- **Server state:** TanStack React Query (all API data)
- **Client state:** Zustand with `persist` middleware (`src/stores/authStore.ts`) — auth token and user info persisted to localStorage as `auth-storage`

### Components (`src/components/`)
- `MainLayout.tsx` — Responsive sidebar layout (Ant Design `Layout` + mobile `Drawer`), renders child routes via `<Outlet />`
- `AddEdit*Modal.tsx` — Modal forms for CRUD operations on each entity
- `FamilyTree.tsx` — Horse pedigree/ancestry tree visualization
- `HorseSelectModal.tsx` — Reusable horse picker (used for parent selection)

### Theme
`ThemeContext` wraps Ant Design's `ConfigProvider` with light/dark toggle. Persisted to localStorage as `udamshil-theme`.

## Key Conventions

- Mongolian field names in data models match the backend API exactly — do not translate them
- All API hooks are re-exported through `src/api/index.ts` — use barrel imports
- Selector hooks (`useUser`, `useAccessToken`, etc.) are defined in `src/stores/authStore.ts` for fine-grained Zustand subscriptions
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enforced
