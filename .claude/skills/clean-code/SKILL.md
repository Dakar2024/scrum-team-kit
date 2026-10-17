---
name: clean-code
description: Use when writing or reviewing any code for this team. The non-negotiable clean-code standard — structure, naming, comments, error handling, security hygiene — so another team can pick the project up and maintain it.
---

# Clean code — standard de l'équipe

Règle d'or : **tout code doit être structuré, lisible, maintenable, et repris sans peine
par une autre équipe.** Ce standard prime sur la rapidité.

## Principes communs
- **Responsabilité unique** : une fonction/classe/module fait une chose.
- **Noms explicites** : le nom dit l'intention ; pas d'abréviation obscure ni de `data2`.
- **Fonctions courtes** : si elle ne tient pas à l'écran ou enchaîne les `if` imbriqués, découpe.
- **Pas de duplication** (DRY), mais pas d'abstraction prématurée non plus.
- **Gestion d'erreurs explicite** : jamais de `except: pass` / `catch {}` muet.
- **Pas de nombre magique** : constantes nommées.
- **Pas de code mort** ni de commentaire-cadavre ; on supprime, Git garde l'historique.

## Commentaires (explicites et courts)
- Commente le **pourquoi**, pas le **quoi** (le code dit déjà le quoi).
- Pas de pavés. Une ligne au-dessus d'une décision non évidente suffit.
- Docstrings sur les signatures publiques (en anglais).

## Python (FastAPI / Litestar / data / ML)
- **Type hints obligatoires** sur les signatures publiques. Async partout pour les I/O.
- **Pydantic v2** pour la validation ; pas de validation manuelle dispersée.
- Logique métier dans `service.py`, hors des routes/controllers.
- **ruff** pour lint + format (le hook qualité le vérifie). Tests **pytest**.
- polars/pandas pour le tabulaire ; polars sur les gros volumes.

## TypeScript / React
- Composants typés, petits, à responsabilité unique. Données dans les hooks, pas dans l'UI.
- Pas de `any` gratuit ; types explicites aux frontières (requests, props).

## Sécurité (hygiène de base, non négociable)
- **Aucun secret en dur** : `.env` / variables d'env, et `.env` dans `.gitignore`.
- **Requêtes SQL paramétrées**, jamais de f-string SQL.
- Valider toutes les entrées ; recalculer montants/totaux **côté serveur**.
- Ne jamais renvoyer le token JWT dans le body (cookie httpOnly uniquement).

## Definition of Done (une tâche n'est "done" que si)
1. Le code respecte ce standard. 2. Lint/format passent (ruff). 3. Les tests passent.
4. Revu par `qa-reviewer`. 5. Documenté par `tech-writer` si c'est un livrable.
