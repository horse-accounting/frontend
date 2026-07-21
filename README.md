# Удамшил — Frontend

Монгол адууны удам угсаа, бүртгэлийн системийн веб аппликейшн. Адуу үржүүлэгчид өөрийн адууны бүртгэл, удмын мод, үүлдэр/бүлгийн ангилал, уралдааны амжилтыг хөтөлнө.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Ant Design 6** — UI
- **TanStack React Query 5** — сервер төлөв
- **Zustand** — auth төлөв (localStorage persist)
- **React Router 7**

Backend нь тусдаа repo (`../backend`, Express + TypeORM + PostgreSQL) — `VITE_API_URL`-ээр холбогдоно. Дэлгэрэнгүй архитектур: `CLAUDE.md`.

## Ажиллуулах

```bash
pnpm install
pnpm dev        # localhost:3001
pnpm build      # production build → dist/
pnpm lint
```

`.env` файлд `VITE_API_URL=http://localhost:3000/api` (эсвэл production backend хаяг) шаардлагатай.

## Deploy

Vercel дээр deploy хийгдэнэ (`vercel.json` — SPA rewrite). `VITE_API_URL`-ийг Vercel-ийн environment variable-аас тохируулна.
