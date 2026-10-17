---
name: scrum-artifacts
description: Use when running the Scrum process for a project — creating or updating the product backlog, sprint backlog, planning, review, and retro artifacts under docs/scrum/. Provides the templates and the ceremony checklist.
---

# Artefacts Scrum

Sur **chaque** projet, le process Scrum est matérialisé par des fichiers sous
`docs/scrum/`. Le Scrum Master les tient à jour ; le PO porte le backlog.

## Arborescence
```
docs/scrum/
├── product-backlog.md
├── sprints/
│   └── sprint-01/
│       ├── planning.md      # sprint goal + sprint backlog
│       ├── review.md        # ce qui est accepté / renvoyé
│       └── retro.md         # ce qui a marché / à améliorer / actions
└── handoff.md               # état repris en début de session suivante
```

## Cérémonies (checklist)
- **Planning** : définir le Sprint Goal, tirer les items du Product Backlog vers le
  Sprint Backlog, les découper en tâches, fixer qui fait quoi. DevOps annonce les branches.
- **Daily** : tour rapide — fait / à faire / blocages. Les blocages vont au Scrum Master.
- **Review** : le PO valide chaque incrément contre ses critères d'acceptation.
- **Rétro** : garder / améliorer / actions concrètes pour le sprint suivant.

## Template — Product Backlog item
```markdown
### PBI-07 — Export CSV des factures  [priorité: Must]
**Story**: En tant que comptable, je veux exporter les factures en CSV afin de les
importer dans mon logiciel.
**Critères d'acceptation**:
- [ ] Bouton "Exporter" sur la liste des factures
- [ ] Le CSV contient : numéro, date, client, montant TTC
- [ ] Seules les factures de l'utilisateur connecté sont exportées
**Estimation**: 3 pts · **Dépend de**: PBI-03
```

## Template — planning.md
```markdown
# Sprint 01 — Planning
**Objectif du sprint**: <une phrase>
**Période**: <début> → <fin>
## Sprint Backlog
| Tâche | PBI | Assigné | Fichiers | État |
|---|---|---|---|---|
| Table + migration invoices | PBI-07 | backend-dev-1 | features/invoices/tables.py | todo |
```

## Template — review.md / retro.md
```markdown
# Sprint 01 — Review
Accepté: PBI-07, PBI-03.  Renvoyé au backlog: PBI-09 (critère 2 non rempli).
Démo / notes pour tech-writer: <...>

# Sprint 01 — Rétro
Garder: … | Améliorer: … | Actions: [ ] … (responsable, échéance)
```

Les tâches vivent aussi dans la **liste de tâches partagée** de l'équipe (TaskCreate),
mais `docs/scrum/` est la trace durable qui survit à la session.
