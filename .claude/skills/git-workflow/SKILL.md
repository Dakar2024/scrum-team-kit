---
name: git-workflow
description: Use when defining or following the versioning strategy on a project — branch model, Conventional Commits, PR and review flow, CI gates. Owned by the devops agent, followed by everyone.
---

# Workflow Git & versioning

Le **DevOps** fixe et annonce ces conventions au démarrage de chaque projet ; tous les
rôles les suivent.

## RÈGLE D'OR — attribution des commits (à vérifier en PREMIER)
Claude ne doit **jamais** apparaître dans un commit : ni auteur, ni co-auteur, ni trailer,
ni mention dans le message. **Interdits absolus** : `Co-Authored-By: Claude...`,
`🤖 Generated with Claude Code`, toute référence à Claude/Anthropic/IA. Seul contributeur :
**Dakar2024** (`dakar08octobre2024@gmail.com`).

Checklist avant **chaque** commit/push (automatique pour tous les agents) :
```bash
# 1) auteur/committer = Dakar2024
git config user.name   # -> Dakar2024
git config user.email  # -> dakar08octobre2024@gmail.com
# 2) message SANS trailer Claude (relire avant de valider)
# 3) si un hook/template ajoute une ligne Claude, la retirer
# 4) controle apres coup
git log -1 --format='%an <%ae>%n%b'   # ne doit contenir que Dakar2024, aucune mention Claude
```
Si un commit déjà écrit contient une trace de Claude, le corriger (`git commit --amend` ou
`git rebase`) avant de pousser.

## Modèle de branches (par défaut)
- `main` — production, toujours déployable.
- `develop` — intégration ; les features y sont mergées.
- `feature/<story>` — une story (part de `develop`).
- `fix/<bug>` — correction (part de `develop`).
- `hotfix/<x>` — correctif urgent (part de `main`, remergé dans `main` et `develop`).

Chaque développeur crée **sa** branche à partir de `develop`. Deux devs ne travaillent
jamais sur les mêmes fichiers dans la même branche.

## Commits — Conventional Commits
```
<type>(<scope>): <résumé impératif court>

[corps optionnel: pourquoi]
```
Types : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`.
Exemple : `feat(invoices): add CSV export endpoint`.

## Pull Request
- Toute intégration vers `develop` passe par une PR.
- CI verte obligatoire : lint (ruff), tests (pytest/vitest), scan sécurité.
- Revue par `qa-reviewer` ; les findings `pentester` bloquants doivent être résolus.
- Squash merge pour garder un historique lisible.

## CI/CD (gates = Definition of Done)
Le pipeline échoue si : lint KO, tests KO, scan de dépendances vulnérables KO.
Un build qui ne passe pas ne merge pas.

## Secrets & versioning
- `.env` **jamais** commité (vérifier `.gitignore`). Secrets CI via le gestionnaire du CI.
- Tag de version sur `main` en SemVer (`v1.2.0`) à chaque release ; `tech-writer` met à
  jour le `CHANGELOG.md`.
