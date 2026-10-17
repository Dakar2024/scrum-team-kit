---
name: design-resources
description: Use during the design phase (ui-ux-designer agent) to source visual direction, layout inspiration, component patterns, and motion ideas. Curated resources from the user's link.md plus how to turn them into a shadcn/ui + Tailwind handoff spec for the React + TanStack frontend.
---

# Ressources de design

Pour la **phase design** uniquement. Transforme l'inspiration en une spec que les
développeurs front-end (React + TanStack + Tailwind v4 + shadcn/ui) peuvent implémenter.

## Ressources (issues de link.md)
| Ressource | Pour quoi | Lien |
|---|---|---|
| design-resources-for-developers | Catalogue : couleurs, fonts, icônes, illustrations, outils | https://github.com/Dakar2024/design-resources-for-developers.git |
| Aceternity UI — studio template | Composants animés, patterns de landing modernes | https://ui.aceternity.com/templates/design-development-studio-template |
| Land-book | Inspiration de landing pages réelles | https://land-book.com/ |
| Variants | Patterns UI / sections de communauté | https://variant.com/community |
| Remotion | Animations/vidéo pilotées par code (motion design) | https://www.remotion.dev/docs/ai/coding-agents |

> Ces liens sont des **sources d'inspiration**, pas des dépendances à copier telles quelles.
> Vérifie la licence avant de réutiliser un composant ou un asset.

## De l'inspiration à la spec (méthode)
1. **Direction visuelle** : fixer palette (tokens Tailwind), typographie (1–2 familles),
   échelle d'espacement, rayons, ombres, mode clair/sombre. S'inspirer de Land-book / Variants.
2. **Patterns de composants** : repérer sur Aceternity / le catalogue les patterns utiles
   (hero, pricing, dashboard, formulaires) et les **mapper sur shadcn/ui** (`src/shared/components/ui/`).
3. **Motion** (optionnel) : si des animations sont voulues, cadrer où et pourquoi
   (Remotion pour la vidéo, sinon transitions Tailwind/tw-animate-css côté front).
4. **Handoff** : produire `docs/design/handoff.md` — par écran : composants shadcn à
   utiliser, variants, états (hover/focus/disabled/loading/error/empty), breakpoints
   responsive, règles d'accessibilité (contraste AA, focus visible, labels).

## Cohérence avec l'architecture du projet
- Le front impose React 19 + TanStack + Tailwind v4 + shadcn/ui (lis `CONTEXT.md` à la
  racine du projet, source de vérité de l'architecture, et le skill `starter-react-tanstack`).
- Les composants s'ajoutent avec `bunx shadcn@latest add <name>` — la spec doit nommer
  les composants shadcn existants quand ils couvrent le besoin, plutôt que d'en inventer.
- Pense i18n (Lingui, fr/en) : prévoir des textes qui s'adaptent à la longueur des langues.

## Skills de design à invoquer au besoin
`design-critique`, `design-system`, `design-handoff`, `accessibility-review`, `ux-copy`,
`ui-ux-pro-max`, `design-taste-frontend` (disponibles dans l'environnement).
