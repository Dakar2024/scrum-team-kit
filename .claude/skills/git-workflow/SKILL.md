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

### Correctif à la racine (automatique, déjà configuré)
Claude Code ajoute ces lignes via un réglage `attribution`. On le **neutralise une fois
pour toutes** plutôt que de nettoyer commit par commit (clé vérifiée dans la doc officielle ;
`includeCoAuthoredBy` est son ancêtre déprécié) :
```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```
- `commit: ""` → supprime le trailer `Co-Authored-By: Claude` des commits.
- `pr: ""` → supprime le footer `Generated with Claude Code` des pull requests.
- Il existe aussi `attribution.sessionUrl` pour omettre le lien de session claude.ai des
  commits cloud / Remote Control.

Ce réglage est **global** (`~/.claude/settings.json`, s'applique à tous les projets) **et**
dans le `.claude/settings.json` du kit (il voyage avec l'équipe). Pour un seul projet sans
versionner le réglage, utiliser `.claude/settings.local.json`. Pas besoin de hook Git par projet.

### Filet de sécurité (chaque agent, avant chaque commit/push)
Le réglage règle le cas normal ; la vérification reste la **garantie** si le réglage n'est
pas appliqué (projet sans le kit, settings non chargé, hook/template qui réinjecte une ligne) :
```bash
# 1) auteur/committer = Dakar2024
git config user.name   # -> Dakar2024
git config user.email  # -> dakar08octobre2024@gmail.com
# 2) message SANS trailer Claude (relire avant de valider ; retirer toute ligne ajoutee)
# 3) controle apres coup
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
