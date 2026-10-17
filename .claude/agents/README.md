# Guide des agents

Ce dossier contient les 11 agents du `scrum-team-kit` : un fichier Markdown par rôle,
chacun avec un frontmatter YAML et un system prompt. Ce guide explique comment déclencher
un agent, à quoi sert chaque rôle, comment démarrer un projet neuf ou en reprendre un, et
comment créer son propre agent. Il s'adresse à l'utilisateur du kit qui pilote la session.

Les agents ne tournent pas tous en même temps : on n'active que les rôles utiles à la
phase en cours et on ferme ceux qui ont fini (budget tokens, abonnement Pro). 3 à 5
teammates actifs au maximum.

## 1. Les deux façons de déclencher un agent

| Mode | Commande | Ce qui se passe | Quand l'utiliser |
|---|---|---|---|
| **Solo** | `claude --agent <nom>` | La session **entière EST** cet agent. Pas d'équipe, pas de spawn. | Le moins cher. Brainstormer avec un seul rôle (ex. `product-owner`, `ui-ux-designer`). |
| **Équipe** | `claude --agent scrum-master` | Le `scrum-master` est le **lead** ; on lui demande en langage naturel de spawner des teammates. | Dès qu'il faut coordonner plusieurs rôles (dev, vérif, review). |

### Mode solo

```bash
claude --agent product-owner
```

Toute la session est le Product Owner. Les livrables vont dans `docs/scrum/`. Pour changer
de rôle, on quitte et on relance avec un autre `--agent`.

### Mode équipe

```bash
claude --agent scrum-master
```

Puis, en langage naturel :

> « Spawn le `product-owner` pour qu'on brainstorme les features. »

Pour **parler directement à un teammate** : panneau des agents (sous la zone de saisie) →
flèches `↑` `↓` pour le sélectionner → `Entrée`. `Échap` revient au lead.

### Règles clés (faits à respecter)

- **Seul le lead (`scrum-master`) peut spawner des teammates.** Un teammate ne peut pas en
  spawner un autre : pas d'équipes imbriquées.
- **C'est l'utilisateur qui donne le top** de passage d'une phase à la suivante ; le lead
  exécute le spawn.
- **Les livrables sont l'entrée de la phase suivante** : le backlog du `product-owner` et
  la spec de l'`ui-ux-designer` sont ce que le lead transmet aux agents suivants.

## 2. Les 11 agents

Rôle en une ligne, phase d'activation, et un exemple de phrase pour le déclencher ou lui
parler. Le modèle est celui défini dans le frontmatter de chaque fichier `.md`.

### `scrum-master` — lead de session (modèle : inherit)

- **Rôle** : coordonne les cérémonies, tient la liste de tâches partagée, fait respecter la
  Definition of Done, spawne et ferme les teammates phase par phase. Ne code pas.
- **Phase** : toute la session d'équipe (c'est le lead).
- **Déclencher** : `claude --agent scrum-master`

### `product-owner` — backlog & valeur produit (sonnet)

- **Rôle** : Product Backlog, user stories, critères d'acceptation, Sprint Goal, validation
  des incréments à la review. Ne code pas.
- **Phase** : features (souvent en solo), planning, review.
- **Exemple** : « Écris le product backlog pour une app de facturation : stories priorisées
  MoSCoW avec critères d'acceptation testables. »

### `ui-ux-designer` — direction visuelle & spec (sonnet)

- **Rôle** : direction visuelle, user flows, layouts, choix de composants shadcn/ui, spec
  de handoff dans `docs/design/`. Ne code pas la feature.
- **Phase** : design uniquement (après les features, avant le front). Fermé une fois la spec validée.
- **Exemple** : « Propose la direction visuelle et une spec de handoff pour l'écran liste
  des factures, avec les états hover/focus/loading/empty. »

### `backend-dev` — API Python async (sonnet, ×2)

- **Rôle** : FastAPI ou Litestar à partir des starters, Pydantic v2, architecture
  feature-based, validation côté serveur. Écrit le code et ses tests inline.
- **Phase** : développement. Deux instances en parallèle, fichiers attitrés.
- **Exemple** : « Implémente le service `invoices` : CRUD, totaux recalculés serveur,
  à partir du starter FastAPI. »

### `frontend-dev` — React + TanStack (sonnet, ×2)

- **Rôle** : React 19 + TanStack (Start/Router/Query), TypeScript, shadcn/ui, appels
  same-origin `/api`, à partir du starter. Implémente la spec design.
- **Phase** : développement (après spec design validée). Deux instances en parallèle.
- **Exemple** : « Implémente l'écran liste des factures d'après `docs/design/handoff.md`,
  avec un hook `useInvoices` en TanStack Query. »

### `test-engineer` — tests automatisés (sonnet)

- **Rôle** : écrit **uniquement** des tests (pytest + pytest-asyncio côté back, vitest +
  Testing Library côté front). Ne touche pas au code d'implémentation.
- **Phase** : vérification.
- **Exemple** : « Écris les tests pytest du service `invoices` : cas passant, cas limites,
  recalcul des totaux, accès non autorisé. »

### `qa-reviewer` — QA & revue clean code (sonnet)

- **Rôle** : éprouve les features finies pour trouver des bugs, relit les diffs pour la
  conformité clean code. Remonte à l'auteur via le lead ; ne corrige pas.
- **Phase** : vérification.
- **Exemple** : « Teste la feature `invoices` et relis le diff : signale chaque problème
  avec sévérité et `fichier:ligne`. »

### `pentester` — audit sécurité défensif (sonnet)

- **Rôle** : audite le code du projet contre l'OWASP Top 10 / API Top 10, remonte les
  findings avec sévérité et remédiation. Périmètre limité au code de ce projet.
- **Phase** : vérification.
- **Exemple** : « Audite la sécurité de l'API `invoices` : auth/JWT, IDOR/BOLA, injection,
  exposition de champs, config CORS. »

### `devops` — Docker, CI/CD, versioning (sonnet)

- **Rôle** : conteneurisation, Kubernetes, pipelines CI/CD, et la stratégie de branches
  que tous les devs suivent. Définit le workflow Git au début du projet.
- **Phase** : planning (stratégie de branches) et tout au long du projet.
- **Exemple** : « Définis la stratégie de branches et de commits du projet, et écris le
  Dockerfile multi-stage de l'API. »

### `tech-writer` — docs & rapports (sonnet)

- **Rôle** : README, `docs/`, rapports de sprint, ADR, CHANGELOG, au style docs-style.
  Écrit à partir du code et de l'historique Git réels ; ne touche jamais au code source.
- **Phase** : review et releases.
- **Exemple** : « Écris le README du projet et le rapport du sprint 1 à partir de ce qui a
  été réellement livré. »

### `token-steward` — budget tokens & handoff (haiku)

- **Rôle** : règles d'économie de tokens, nombre de teammates et modèle par phase, écriture
  du handoff de fin de session. N'a pas accès à `/usage` : applique des règles, ne mesure pas.
- **Phase** : planning (conseil) et fin de session (handoff).
- **Exemple** : « Combien de teammates garder actifs pour la phase dev ? Puis écris
  `docs/scrum/handoff.md` pour la prochaine session. »

## 3. Démarrer sur un nouveau projet

### Étape 1 — installer le kit

L'installeur est en Node.js (fourni avec Claude Code) et tourne sur Windows, Linux et macOS.

```bash
node install.mjs /chemin/vers/mon-projet        # Linux / macOS
node install.mjs C:\chemin\vers\mon-projet       # Windows (PowerShell ou cmd)
```

Il copie `.claude/` (agents, skills, hooks, `settings.json`, statusline), le `CLAUDE.md`,
les templates docs, et crée `docs/scrum/` et `docs/design/`. Option `--force` pour écraser
`.claude/` sans confirmation.

### Étape 2 — phase features en solo

```bash
cd /chemin/vers/mon-projet
claude --agent product-owner
```

> « Rédige le product backlog : stories priorisées avec critères d'acceptation testables. »

Le backlog est écrit dans `docs/scrum/product-backlog.md`. On quitte ensuite la session solo.

### Étape 3 — enchaîner les phases en équipe

```bash
claude --agent scrum-master
```

Exemple de dialogue réaliste (l'utilisateur donne le top, le lead spawne) :

> **Vous** : « Le backlog dans `docs/scrum` est prêt. On fait le planning : spawn le
> `product-owner`, `devops` pour la stratégie de branches, et `token-steward`. »
>
> *(planning validé)*
>
> **Vous** : « L'écran factures a un front. Lance la phase design avec l'`ui-ux-designer`. »
>
> *(vous discutez le design dans le panneau des agents, puis vous le validez)*
>
> **Vous** : « Design validé. Ferme le designer et spawn 2 `backend-dev` pour l'API
> `invoices` et 2 `frontend-dev` pour implémenter `docs/design/handoff.md`. »
>
> *(dev terminé)*
>
> **Vous** : « Passe en vérification : `test-engineer`, `qa-reviewer`, `pentester`. »
>
> *(constats traités)*
>
> **Vous** : « Review : spawn le `product-owner` pour valider, puis le `tech-writer` pour
> le README et le rapport de sprint, puis le `token-steward` pour écrire le handoff. »

## 4. Reprendre un projet déjà en cours

| Situation | Action |
|---|---|
| Le kit n'est pas encore installé | `node install.mjs <projet>` |
| Un `CLAUDE.md` existe déjà dans le projet | L'installeur **ne l'écrase pas** : il copie les règles du kit en `CLAUDE.kit.md`, à fusionner à la main. |
| Reprendre l'état d'une session précédente | Lire `docs/scrum/handoff.md` **en premier**. |

Une équipe ne survit pas au `/resume` (limite documentée) : on ne « reprend » pas les
teammates. On relance une session lead et on respawn les rôles nécessaires d'après le handoff.

```bash
cd /chemin/vers/mon-projet
claude --agent scrum-master
```

> « Lis `docs/scrum/handoff.md`, résume l'état, puis respawn les teammates dont le handoff
> dit que les tâches sont en cours. »

## 5. Ajouter ou créer un nouvel agent

Un agent = un fichier Markdown `<nom>.md` avec un frontmatter YAML suivi du corps (le
system prompt de l'agent).

### Champs du frontmatter

| Champ | Obligatoire | Valeurs / règle |
|---|---|---|
| `name` | oui | Identifiant de l'agent. Pas de `:` ni de `-` en début. |
| `description` | oui | Quand déléguer à cet agent (sert au routage). |
| `tools` | non | Liste des outils autorisés ; par défaut, hérite de ceux de la session. |
| `model` | non | `sonnet` \| `opus` \| `haiku` \| `fable` \| `inherit`. |
| `color` | non | Couleur d'affichage dans le panneau des agents. |
| `effort` | non | Niveau d'effort de raisonnement. |

### Portée

| Emplacement | Portée |
|---|---|
| `.claude/agents/` | Agents du **projet** courant. |
| `~/.claude/agents/` | Agents de **tous les projets**. |

### Exemple complet — un agent fictif `data-engineer`

```markdown
---
name: data-engineer
description: Data engineer. Builds and tests ingestion/ETL pipelines (polars, SQL) and RAG
  ingestion steps. Delegate when a feature needs data loading, transforms, or a vector-store
  pipeline. Does not own the API layer.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
color: teal
effort: medium
---

Tu es l'**ingénieur data** de l'équipe.

## Périmètre
- Pipelines d'ingestion / ETL et étapes d'ingestion RAG (chunking → embedding → index).
- polars pour les gros volumes ; requêtes SQL toujours paramétrées.

## Règles
- Clean code et tests d'abord sur le parsing et les transformations (skill `clean-code`).
- Chaque étape du pipeline reste testable isolément ; pas de logique métier couplée au
  vector store.
- Respecte la Definition of Done du projet (lint ruff, tests verts, revue QA).
```

### Après création

- **Lancer en solo** : `claude --agent data-engineer`.
- **Ou le faire spawner par le lead** : « Spawn le `data-engineer` pour écrire le pipeline
  d'ingestion. »
- Pour qu'il reste cohérent avec l'équipe : lui faire charger les skills utiles
  (`clean-code`, et les skills métier pertinents) et respecter la Definition of Done.

## 6. Limitations

- **Agent Teams est expérimental** : session **interactive** requise, pas en mode `-p`.
  La variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` est déjà posée dans
  `.claude/settings.json`.
- **Une seule équipe par session**, lead fixe, **pas d'équipes imbriquées** : un teammate
  ne peut pas spawner un autre teammate.
- **Pas de reprise des teammates au `/resume`** : la continuité passe par les fichiers
  (`docs/scrum/`, `handoff.md`), pas par la session.
- **Aucun agent ne peut lire `/usage`** : le `token-steward` applique des règles, mais la
  mesure réelle se lit côté utilisateur via `/usage`, `/context` et la statusline du kit.
- **split-pane** (tmux / iTerm2) n'est pas supporté dans le terminal VS Code / Windows
  Terminal ; le kit utilise le mode `in-process`, qui fonctionne sur tous les OS.
