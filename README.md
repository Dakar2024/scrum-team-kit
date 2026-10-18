# scrum-team-kit

Une **équipe d'agents Claude Code** organisée comme une équipe Scrum (chef de projet,
analyste, Product Owner, designer, développeurs, testeurs, sécurité, DevOps, rédacteur).
Tu l'installes dans **n'importe quel projet**, neuf ou déjà commencé, et les agents
travaillent ensemble, chacun son métier.

Ce README explique, pas à pas et **sans rien supposer connu** : où taper les commandes,
par quel agent commencer, et comment passer d'un agent au suivant.

---

## 1. La seule chose à bien comprendre : OÙ on tape quoi

Il y a **deux endroits** différents. Ne les confonds pas.

| Endroit | C'est quoi | On y tape… |
|---|---|---|
| **Le terminal** | La fenêtre noire : PowerShell, ou « Git Bash » (MINGW64) | Les commandes qui **lancent** quelque chose : installer le kit, démarrer un agent (`node …`, `claude …`) |
| **La session Claude Code** | Ce qui s'ouvre **après** avoir tapé `claude …` dans le terminal : tu discutes avec l'agent | Des **phrases normales** (« Spawn le product-owner… »). Pas de commande technique ici. |

Règle simple :
- **Pour démarrer un agent** → terminal.
- **Pour parler à un agent déjà démarré** → dans la session Claude Code (en français, normalement).

> ⚠️ Sur Git Bash (MINGW64), écris les chemins avec des **slashes** `/`, jamais `\`.
> `C:\Users\...` casse (les `\` disparaissent). Écris `/c/Users/...`.

---

## 2. Installer le kit dans un projet

Tu fais ça **une fois par projet**, dans le **terminal**.

**Étape A — va dans le dossier du kit :**
```bash
cd /c/Users/PC/Documents/claude/scrum-team-kit
```

**Étape B — installe dans ton projet** (remplace le chemin par celui de TON projet) :
```bash
node install.mjs /c/Users/PC/Documents/mon-projet
```

Ce que tu dois voir s'afficher :
```
Copie : .claude/ (agents, skills, hooks, settings.json, statusline.js)
Copie : CONTEXT.md (template d'architecture a remplir au planning)
Cree : docs/scrum/ + docs/design/ + docs/docs-templates/
```
- Si ton projet a **déjà** un `CLAUDE.md`, il n'est **pas écrasé** : les règles du kit
  arrivent dans `CLAUDE.kit.md` (tu les recopies à la main dans ton `CLAUDE.md`).
- Ajoute `--force` à la fin pour réinstaller par-dessus une version précédente du kit.

---

## 3. Par quel agent commencer ? (le plus important)

Ça dépend de l'état du projet. Regarde la ligne qui te correspond :

| Ton projet | Premier agent | Pourquoi |
|---|---|---|
| **Neuf et vide** (aucun code encore) | `product-owner` | Rien à analyser : on commence par définir les besoins (le backlog). |
| **Déjà du code** (projet existant où tu viens d'ajouter le kit) | `project-analyst` | Il lit d'abord le code pour savoir ce qui existe, puis passe la main au `product-owner`. |
| **Projet d'équipe repris** (on travaillait déjà avec les agents hier) | `project-analyst` | Il lit `docs/scrum/handoff.md` + le code et dit **où on en était** et **quel agent reprendre**. |

**Comment démarrer cet agent** → dans le **terminal** :
```bash
cd /c/Users/PC/Documents/mon-projet
claude --agent product-owner        # projet neuf et vide
# ou :
claude --agent project-analyst      # projet qui a déjà du code
```

---

## 4. Le déroulé complet, étape par étape

Chaque agent, **quand il finit**, dit quel agent devrait prendre la suite. Mais **c'est
toi qui donnes le feu vert** à chaque étape. Et **seul le Scrum Master peut lancer
(« spawner ») les autres agents** — un agent ne peut pas en lancer un autre.

### A) Projet NEUF et vide

1. **Terminal :** `claude --agent product-owner`
   Tu brainstormes les fonctionnalités avec lui. Il écrit le **backlog** dans
   `docs/scrum/product-backlog.md`. → Il te recommande de passer au design ou au dev.
2. **Terminal :** `claude --agent scrum-master` (c'est le chef d'équipe à partir d'ici).
   Dans la session, tu écris, par exemple :
   > « Le backlog est prêt dans `docs/scrum`. Fais le planning avec le `devops` (branches)
   >  et le `token-steward`. »
3. **Si l'écran a un front** → tu dis : « Lance la phase design avec le `ui-ux-designer`. »
   Il produit une spec dans `docs/design/`. Les développeurs front **attendent** qu'elle
   soit validée.
4. **Développement** → « Design validé. Spawn 2 `backend-dev` pour l'API et 2 `frontend-dev`
   pour implémenter la spec. »
5. **Vérification** → « Passe en vérif : `test-engineer`, `qa-reviewer`, `pentester`. »
6. **Clôture** → « Review avec le `product-owner`, puis le `tech-writer` pour la doc, puis
   le `token-steward` pour écrire le handoff. »

### B) Projet qui a DÉJÀ du code

1. **Terminal :** `claude --agent project-analyst`
   Il lit le code, remplit `CONTEXT.md` (stack réelle, arborescence, **ce qui est fait vs
   à faire**). → Il **passe la main au `product-owner`** et te dit ce qu'il a trouvé.
2. **Terminal :** `claude --agent product-owner`
   À partir de ce que l'analyste a trouvé, vous discutez de **ce qui reste à faire**. Il
   écrit le **backlog** (`docs/scrum/product-backlog.md`) : items déjà faits (cochés) +
   items restants, priorisés.
3. **Ensuite :** `claude --agent scrum-master`, puis même enchaînement qu'au A (design →
   dev → vérif → review).

> Différence clé : sur un projet existant, le `project-analyst` dresse la **photo
> technique** (ce qui existe), et le `product-owner` définit avec toi **la suite** (ce
> qu'il faut livrer, et dans quel ordre).

---

## 5. Le fichier backlog et le tech-writer (à lire)

- Le **backlog** est le fichier `docs/scrum/product-backlog.md`. C'est **le** document que
  tous les agents lisent pour savoir quelle fonctionnalité faire. Le `product-owner`
  l'écrit ; chaque item a une user story et des critères d'acceptation (cases à cocher).
- Le **`tech-writer` reste à l'écoute pendant tout le développement**. Dès qu'une
  fonctionnalité du backlog est livrée, c'est lui qui va **la cocher** (`- [x]`) dans le
  backlog. Ainsi, le backlog montre à tout moment ce qui est fait et ce qui reste.
- Le `tech-writer` écrit aussi le `README` du projet, les rapports de sprint et le `CHANGELOG`.

---

## 6. Les 12 agents (qui fait quoi)

| Agent | Rôle | Quand l'activer |
|---|---|---|
| `scrum-master` | Chef d'équipe (lead). Lance les autres agents, fait respecter les règles. | Toute la session d'équipe |
| `project-analyst` | Lit le projet, remplit `CONTEXT.md`, oriente la reprise. | **En premier**, sur un projet qui a du code |
| `product-owner` | Besoins, backlog, priorités, validation. | Phase besoins + review |
| `ui-ux-designer` | Direction visuelle + spec de design. | Phase design (avant le front) |
| `backend-dev` (×2) | API Python (FastAPI/Litestar) depuis les starters. | Développement back |
| `frontend-dev` (×2) | React + TanStack depuis le starter, implémente la spec design. | Développement front |
| `test-engineer` | Écrit **uniquement** les tests. | Vérification |
| `qa-reviewer` | Teste les features, relit le clean code. | Vérification |
| `pentester` | Audit sécurité (OWASP). | Vérification |
| `devops` | Docker, CI/CD, versioning, config serveur. | Planning + tout du long |
| `tech-writer` | Docs, README, rapports, **coche le backlog**. | En continu + review |
| `token-steward` | Économie de tokens, écrit le handoff de fin de session. | Planning + fin de session |

---

## 7. Aide-mémoire des commandes

**Dans le TERMINAL** (pour démarrer) :
```bash
# Installer le kit dans un projet
cd /c/Users/PC/Documents/claude/scrum-team-kit
node install.mjs /c/Users/PC/Documents/mon-projet

# Aller dans le projet et démarrer un agent
cd /c/Users/PC/Documents/mon-projet
claude --agent product-owner      # un seul agent (mode solo, le moins cher)
claude --agent project-analyst    # pour un projet qui a déjà du code
claude --agent scrum-master       # le chef d'équipe (pour coordonner plusieurs agents)
```

**Dans la SESSION Claude Code** (une fois le `scrum-master` lancé, tu écris en français) :
```
Spawn le product-owner pour qu'on brainstorme les fonctionnalités.
Design validé. Spawn 2 backend-dev et 2 frontend-dev.
Passe en vérification : test-engineer, qa-reviewer, pentester.
```
**Pour parler à un agent précis** déjà lancé : dans le panneau sous la zone de saisie,
flèches `↑` `↓` pour le choisir, `Entrée` pour lui écrire, `Échap` pour revenir au chef.

---

## 8. Règles d'or (toujours respectées)

- **Clean code** obligatoire : code propre, lisible, repris par une autre équipe.
- **Aucune trace de Claude** dans les commits (ni co-auteur, ni footer). Seul **Dakar2024**
  apparaît. (Déjà réglé automatiquement par `attribution` dans les settings.)
- **Secrets** uniquement via `.env` (jamais en dur), `.env` dans `.gitignore`.
- **Definition of Done** : clean code + lint + tests verts + revue QA + doc si livrable.

---

## 9. Limites (à connaître)

- **Agent Teams est expérimental** : il faut une session **interactive** (pas en mode `-p`).
- **Une seule équipe par session**, pas d'équipes imbriquées, le chef est fixe.
- **Les agents ne reviennent pas après un `/resume`** : la continuité passe par les fichiers
  (`docs/scrum/handoff.md`, `CONTEXT.md`, le backlog). Au redémarrage, le `project-analyst`
  les relit et dit par où reprendre.
- Un agent **ne lit pas `/usage`** : le `token-steward` applique des règles ; toi tu vois la
  consommation via `/usage`, `/context` et la statusline.
- **Split-pane** (tmux/iTerm2) non supporté dans VS Code / Windows Terminal → mode
  `in-process` (fonctionne partout, tous OS).

---

## 10. Réutiliser le kit sur une autre machine / un autre projet

Le kit est multiplateforme (Windows, Linux, macOS — tout tourne sous Node, fourni avec
Claude Code). Sur une autre machine :
```bash
git clone <url-de-ton-depot-scrum-team-kit>
cd scrum-team-kit
node install.mjs /chemin/vers/un-projet
```

## Contenu du kit
```
scrum-team-kit/
├── install.mjs                 # installeur (Node, cross-platform)
├── CLAUDE.md                   # règles du projet (clean code, Scrum, stack, attribution)
├── docs-templates/
│   ├── CONTEXT.template.md     # → déposé en CONTEXT.md dans chaque projet
│   └── DEPENDENCY-REPORT.md    # vérif des starters (versions + sécurité)
└── .claude/
    ├── settings.json           # Agent Teams, Sonnet par défaut, attribution, hook, statusline
    ├── statusline.js           # contexte + coût en continu
    ├── hooks/definition-of-done.js   # porte qualité (ruff) sur TaskCompleted
    ├── agents/                 # les 12 rôles (+ README.md : guide détaillé des agents)
    └── skills/                 # clean-code, scrum-artifacts, git-workflow, design-resources,
                                # starter-fastapi/litestar/react-tanstack, email-resend,
                                # docs-style, security-audit
```
