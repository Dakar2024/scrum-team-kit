---
name: docs-style
description: Use when writing a README, docs page, sprint report, ADR, or CHANGELOG for this team. The documentation style modeled on Anthropic's technical docs — structure, tone, tables over prose, copy-pasteable verified commands, honest limitations. Owned by the tech-writer agent.
---

# Style de documentation

Objectif : des docs qu'un professionnel de la documentation chez Anthropic validerait —
claires, vérifiées, utiles tout de suite. Il n'existe pas de guide de style Anthropic
public officiel ; ce standard reprend la **forme observée** dans la documentation Claude.

## Principes
- **Dire d'abord ce que c'est et pour qui**, en une phrase, avant tout détail.
- **Quand l'utiliser / quand ne pas l'utiliser** quand un choix existe.
- **Tableaux comparatifs** plutôt que de longs paragraphes (options, variables, endpoints).
- **Blocs de commandes copiables**, exacts, **testés** avant publication.
- **Limitations** assumées, puis **Troubleshooting**, puis **Next steps**.
- Ton neutre, phrases courtes, pas de superlatifs marketing. Anglais pour le code et les
  identifiants ; corps du texte selon la langue du projet.
- **Rien d'affirmé sans vérification** : une commande non exécutée ne va pas dans le README.

## Squelette de README
```markdown
# <Projet>
<Une phrase: ce que fait le projet et pour qui.>

## Stack
| Couche | Techno |  (tableau)

## Démarrage rapide
### Prérequis
### 1. Cloner et configurer   (bloc bash)
### 2. Lancer                  (bloc bash)

## Variables d'environnement
| Variable | Obligatoire | Description |

## Architecture         (arborescence + 2-3 lignes par dossier clé)
## Commandes            (tableau commande → effet)
## Tests
## Limitations / TODO   (stubs NotImplementedError, ce qui reste)
## Troubleshooting
```

## ADR (Architecture Decision Record)
```markdown
# ADR-003 — Choisir Litestar plutôt que FastAPI pour ce service
**Statut**: accepté (2026-10-17)
**Contexte**: <le problème, les contraintes>
**Décision**: <ce qu'on fait>
**Conséquences**: <+ / − , ce que ça implique>
```

## CHANGELOG (Keep a Changelog + SemVer)
```markdown
## [1.2.0] - 2026-10-17
### Added    - Export CSV des factures (PBI-07)
### Fixed    - Fuite de champ `hashed_password` dans /users/me
### Security - Mise à jour python-jose (algorithm confusion)
```

## Rapport de sprint
Reprend `docs/scrum/sprints/sprint-NN/review.md` et en fait un résumé lisible pour une
partie prenante : objectif, livré, non livré (+ raison), métriques (tests, couverture),
constats sécurité/QA, prochaines étapes.
