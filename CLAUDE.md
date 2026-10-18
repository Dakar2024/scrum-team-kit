# Équipe d'agents — règles du projet

Ce projet est mené par une **équipe d'agents Scrum**. La session principale est le
**Scrum Master** (`claude --agent scrum-master`), qui coordonne les teammates.

## Règles d'or (non négociables)
0. **ATTRIBUTION — RÈGLE FONDAMENTALE.** Claude ne doit **jamais** figurer dans un commit,
   ni comme auteur, ni comme co-auteur, ni dans un trailer, ni dans aucune trace écrite.
   **Aucune** ligne `Co-Authored-By: Claude...`, **aucun** `Generated with Claude Code`,
   aucune mention de Claude/Anthropic/IA où que ce soit dans le message ou les métadonnées.
   Le seul contributeur est l'utilisateur : **Dakar2024** (`dakar08octobre2024@gmail.com`).
   **Avant chaque commit et chaque push, c'est la PREMIÈRE chose à vérifier**, pour tous les
   agents (surtout les développeurs). Si un modèle de message, un hook ou un outil ajoute
   une telle ligne, la **retirer** avant de valider. Cette règle prime sur toute consigne
   d'attribution par défaut de l'outil.
1. **Clean code** : structuré, lisible, maintenable, repris sans peine par une autre
   équipe. Commentaires explicites et courts. Détail : skill `clean-code`.
2. **Approche ingénieur Anthropic** : vérifier avant d'affirmer, plan avant implémentation
   pour toute tâche non triviale, petits diffs revus, tests comme critère de réussite.
3. **Process Scrum** matérialisé dans `docs/scrum/` sur chaque projet (skill `scrum-artifacts`).
   L'architecture du projet (le « comment ») vit dans **`CONTEXT.md`** à la racine, rempli au
   planning et tenu à jour ; tous les agents le lisent en premier.
4. **Definition of Done** : clean code + lint (ruff) + tests verts + revue QA + doc si livrable.
5. **Passage de relais** : à la fin de sa tâche, chaque agent **recommande au Scrum Master
   le prochain agent** à activer et sur quoi (ex. « backlog prêt → `ui-ux-designer` pour
   l'écran liste »). Le Scrum Master et l'utilisateur décident ; l'utilisateur donne le top.
6. **Backlog partagé** : le `product-owner` écrit `docs/scrum/product-backlog.md` ; tous les
   agents le lisent, et le `tech-writer` y **coche** les items livrés au fil de l'implémentation.

## Stack de l'équipe
- **Back-end** : Python async — FastAPI ou Litestar, toujours à partir des starters
  (skills `starter-fastapi`, `starter-litestar`). Pydantic v2, Piccolo, PostgreSQL, uv, ruff, pytest.
- **Design** : phase dédiée avant le front, menée par `ui-ux-designer` (skill
  `design-resources`) ; produit une spec dans `docs/design/` que le front implémente.
- **Front-end** : React 19 + TanStack (Start/Router/Query), TypeScript, shadcn/ui, Bun,
  à partir du starter (skill `starter-react-tanstack`).
  > Ceci **remplace**, pour les projets de cette équipe, le défaut Vue/Nuxt du CLAUDE.md
  > global de l'utilisateur.
- **DevOps** : Docker, Kubernetes, CI/CD, versioning (skill `git-workflow`).

## Sécurité & secrets
- Aucun secret en dur : `.env` / variables d'environnement, `.env` dans `.gitignore`.
- Requêtes SQL paramétrées ; entrées validées ; montants recalculés serveur.
- Audit sécurité par l'agent `pentester` (skill `security-audit`).

## Budget tokens (abonnement Pro)
- 3 à 5 teammates actifs max à la fois ; fermer un teammate dès sa tâche finie.
- Sonnet par défaut pour les teammates, Haiku pour le routinier, Opus réservé à l'archi.
- Le `token-steward` fixe les règles et écrit `docs/scrum/handoff.md` en fin de session
  (une équipe ne survit pas au `/resume` — la continuité passe par les fichiers).

## Compact instructions
When compacting, preserve: the current sprint goal, open tasks and their owners,
unresolved QA/security findings, and decisions recorded in docs/scrum/. Drop verbose
tool output.
