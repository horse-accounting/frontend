# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm dev        # Start development server with HMR
pnpm build      # TypeScript check + production build
pnpm lint       # Run ESLint
pnpm preview    # Preview production build
```

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite 7** for build tooling
- **Ant Design 6** for UI components
- **TanStack React Query** for server state
- **Zod 4** for schema validation
- **pnpm** as package manager

## Architecture

This is a Vite-based React SPA. Entry point is `src/main.tsx` which renders `App.tsx` into the root element in `index.html`.

Source code lives in `src/` with assets in `src/assets/`. Static public files go in `public/`.

## TypeScript Configuration

Strict mode is enabled with additional checks:
- `noUnusedLocals` and `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`

Uses the new JSX transform (`react-jsx`) - no need to import React in components.

## Linting

ESLint uses flat config format (`eslint.config.js`) with:
- TypeScript ESLint rules
- React Hooks rules
- React Refresh validation for Vite HMR
