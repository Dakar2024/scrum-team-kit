# scrum-team-kit

Équipe d'agents Claude Code organisée comme une équipe Scrum, **portable d'un projet à
l'autre**. La session principale (Scrum Master) coordonne des teammates spécialisés qui
collaborent via la liste de tâches partagée et la messagerie inter-agents.

## Pour qui
Projets full-stack de l'utilisateur : back-end Python (FastAPI / Litestar) + front React
+ TanStack, avec clean code, Scrum et DevOps comme règles de base.

## L'équipe (11 rôles)

| Agent | Rôle | Modèle | Instances |
|---|---|---|---|
| `scrum-master` | Lead de session, cérémonies, Definition of Done | inherit | 1 (lead) |
| `product-owner` | Backlog, user stories, critères d'acceptation, review | sonnet | 1 |
| `ui-ux-designer` | Direction visuelle + spec de handoff (phase design) | sonnet | 1 |
| `backend-dev` | FastAPI / Litestar depuis les starters | sonnet | 2 |
| `frontend-dev` | React + TanStack depuis le starter | sonnet | 2 |
| `test-engineer` | Écrit uniquement les tests (pytest, vitest) | sonnet | 1 |
| `qa-reviewer` | Teste les features, revue clean code | sonnet | 1 |
| `pentester` | Audit sécurité défensif (OWASP) | sonnet | 1 |
| `devops` | Docker, K8s, CI/CD, versioning | sonnet | 1 |
| `tech-writer` | README, docs, rapports, ADR, CHANGELOG | sonnet | 1 |
| `token-steward` | Budget tokens, règles d'économie, handoff | haiku | 1 |

Les agents **ne tournent pas tous en même temps** : on n'active que les rôles utiles à la
phase et on ferme ceux qui ont fini (budget tokens, abonnement Pro). 3 à 5 teammates max
à la fois.

## Flux par phases
```
features        planning        design            dev               vérif            review
product-owner → PO + devops  → ui-ux-designer → backend-dev ×2   → test-engineer  → product-owner
(mode solo)     + token-        (si front)       frontend-dev ×2    qa-reviewer       tech-writer
                steward         spec validée →    (impl. la spec)    pentester         token-steward
                                puis front-end                                        (handoff)
```
Tu donnes le top de passage d'une phase à l'autre ; le **lead** exécute le spawn
(un teammate ne peut pas en spawner un autre — seul le lead spawn).

## Installation dans un projet
Multiplateforme (Windows / Linux / macOS) — l'installeur et les scripts tournent sous
**Node.js**, fourni avec Claude Code.
```bash
node install.mjs /chemin/vers/mon-projet        # Linux / macOS
node install.mjs C:\chemin\vers\mon-projet       # Windows (PowerShell ou cmd)
cd /chemin/vers/mon-projet
claude --agent scrum-master
```
L'installeur copie `.claude/` (agents, skills, hooks, `settings.json`, statusline), le
`CLAUDE.md`, les templates docs, et crée `docs/scrum/`. Option `--force` pour écraser
sans confirmation.

## Contenu
```
scrum-team-kit/
├── install.mjs                 # installeur portable (Node, cross-platform)
├── CLAUDE.md                   # règles du projet (clean code, Scrum, stack, budget)
├── docs-templates/
│   └── DEPENDENCY-REPORT.md    # vérif des starters (versions + alerte sécurité), 2026-10-17
└── .claude/
    ├── settings.json           # active Agent Teams, Sonnet par défaut, hook, statusline
    ├── statusline.js           # contexte + coût en continu (Node)
    ├── hooks/definition-of-done.js    # porte qualité (ruff) sur TaskCompleted (Node)
    ├── agents/                 # les 11 rôles
    └── skills/                 # clean-code, scrum-artifacts, git-workflow, design-resources,
                                # starter-fastapi/litestar/react-tanstack, email-resend,
                                # docs-style, security-audit
```

## Comment travailler avec l'équipe

### Déclencher un agent
Deux modes :
- **Solo (le moins cher)** — pour brainstormer avec un seul agent, lance-le comme session
  principale : `claude --agent product-owner`. Toute la session EST cet agent. Idéal pour
  la phase « discuter des fonctionnalités ». Les livrables vont dans `docs/scrum/`.
- **Équipe** — `claude --agent scrum-master`, puis en langage naturel : « Spawn le
  product-owner pour qu'on brainstorme les features. » Pour parler directement à un
  teammate : panneau des agents (sous la saisie) → ↑↓ pour le sélectionner → **Entrée**.

### Passer d'une phase à l'autre (qui délègue ?)
**Toi** tu donnes le top ; **le lead** exécute. Un teammate (PO, designer...) ne peut pas
spawner d'autres agents — seul le lead spawn. Exemple de session :
> `claude --agent scrum-master`
> « Le backlog dans docs/scrum est prêt. Lance la phase design avec le ui-ux-designer. »
> *(tu discutes le design, tu le valides)*
> « Design validé. Ferme le designer et spawn 2 frontend-dev pour implémenter la spec,
>  plus 2 backend-dev pour l'API invoices. »

Le PO produit le backlog, le designer produit la spec : ces livrables deviennent l'entrée
que le lead donne aux développeurs. En fin de session, demande au `token-steward` le handoff.

## Limites (documentées côté Claude Code)
- **Agent Teams est expérimental** : session interactive requise, pas en mode `-p`.
- **Une seule équipe par session**, pas d'équipes imbriquées, lead fixe.
- **Pas de reprise des teammates au `/resume`** : la continuité passe par `docs/scrum/`
  (backlog, sprints, `handoff.md`). Le `token-steward` écrit ce handoff.
- Un agent **ne peut pas lire `/usage`** : le `token-steward` applique des règles, la
  mesure se lit via la statusline, `/usage` et `/context`.
- **split-pane** (tmux/iTerm2) non supporté dans le terminal VS Code / Windows Terminal ;
  le kit utilise donc le mode `in-process` (fonctionne partout, tous OS).

## Multiplateforme
L'installeur (`install.mjs`), la statusline (`.claude/statusline.js`) et le hook
(`.claude/hooks/definition-of-done.js`) sont écrits en **Node.js** (fourni avec Claude
Code) : ils tournent à l'identique sur **Windows, Linux et macOS**, sans dépendance à
PowerShell ni à un shell particulier.

## Dépendances des starters — à vérifier avant chaque projet
Voir `docs-templates/DEPENDENCY-REPORT.md`. En résumé (2026-10-17) : back-ends à jour mais
`python-jose` vulnérable (migrer vers `PyJWT`) ; front React/TanStack avec plusieurs
retards majeurs (typescript, vite, vitest, ky, jotai, lingui...) à monter progressivement.
