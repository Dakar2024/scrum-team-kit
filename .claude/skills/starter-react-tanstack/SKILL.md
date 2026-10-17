---
name: starter-react-tanstack
description: Use when starting or extending a React + TanStack frontend for this team. Explains how to begin from the react-app-starter-with-tanstack repo (TanStack Start SSR, Bun, shadcn/ui, TanStack Query, ky, Lingui) and the requests->hooks->page data chain, instead of scaffolding from scratch.
---

# Starter React + TanStack

Point de départ obligatoire pour tout front de l'équipe. **Ne jamais repartir de zéro**.

Dépôt : `https://github.com/Dakar2024/react-app-starter-with-tanstack.git`

## Stack du starter
React 19 · TanStack Start (SSR) + Router (file-based) + Query · Runtime **Bun** ·
Tailwind CSS v4 + shadcn/ui · HTTP **ky** · toasts **sonner** · état **jotai** ·
i18n **Lingui** (fr/en) · images `@unpic/react` · tests vitest + Testing Library.

## Démarrer un projet
```bash
git clone https://github.com/Dakar2024/react-app-starter-with-tanstack.git <projet>
cd <projet>
bun install
bun --bun vite dev        # http://localhost:3000/fr
```
Build/prod : `bun --bun vite build` puis `bun run server.ts`. Docker : `docker build -t <x> .`.

## Structure
`src/app/` routes file-based (`__root.tsx`, `$lang/index.tsx`, ...) · `src/middlewares/`
(i18n, guard) · `src/shared/` (components/ui shadcn, providers, hooks, requests, stores) ·
`src/lib/` (`http-client.ts`, `utils.ts`) · `src/locales/` (catalogues Lingui).

## Chaîne de données (pattern imposé)
```
requests/<feature>-requests.ts   →   hooks/use<Feature>.ts   →   Page
   (handleHttpRequest /api/...)       (useQuery/useMutation,       (consomme le hook)
                                       query keys, toast, invalidation)
```
- `handleHttpRequest` (`@/lib/http-client`, basé sur ky) : `credentials:'include'` pour le
  cookie JWT, retry, gestion d'erreur centralisée. Tous les endpoints visent `/api/...`.
- La Page **ne doit jamais** appeler un request directement — toujours via un hook.
- État global transverse via **jotai** (`stores/`). Alias `@/` → `src/`.

## Ajouter un composant shadcn / extraire l'i18n
```bash
bunx shadcn@latest add button
bun run extract && bun run compile   # messages Lingui
```

## Règles
- TypeScript partout, composants petits et typés, pas de fetch dans les composants de présentation.
- Jamais de secret dans le bundle : `import.meta.env.VITE_*`.
- Tests avec vitest, écrits par `test-engineer`.

## Versions — le starter est en retard (vérifié 2026-10-17)
⚠️ Plusieurs dépendances ont des **versions majeures plus récentes**. Au démarrage d'un
nouveau projet, mettre à jour en connaissance de cause (voir
`docs-templates/DEPENDENCY-REPORT.md`). Majeures en retard notables : Lingui 5→6,
jotai 2→3, ky 1→2, vite 7→8, vitest 3→5, typescript 5→7, jsdom 27→30,
@vitejs/plugin-react 5→6, lucide-react 0.544→1.x, @types/node 22→26. Les paquets
TanStack (1.141→1.169) et React (19.2→19.3) sont des mises à jour mineures sûres.
Fais une MAJ progressive et lance les tests après chaque bump majeur.
