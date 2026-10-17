---
name: starter-fastapi
description: Use when starting or extending a FastAPI backend for this team. Explains how to begin from the Api-starter-Fastapi repo (feature-based, Piccolo, PostgreSQL, MinIO, Huey, JWT cookie auth) instead of scaffolding from scratch.
---

# Starter FastAPI

Point de départ obligatoire pour toute API FastAPI de l'équipe. **Ne jamais repartir
de zéro** : cloner le starter, configurer `.env`, implémenter les `service.py`.

Dépôt : `https://github.com/Dakar2024/Api-starter-Fastapi.git`

## Stack du starter
FastAPI (async) · Piccolo ORM + asyncpg + PostgreSQL 16 · MinIO (fichiers) ·
Huey + Redis (tâches de fond) · Auth JWT en cookie httpOnly + Argon2 · Pydantic v2 ·
slowapi (rate limit 60/min) · Gunicorn + Uvicorn en prod · Pytest.

## Démarrer un projet
```bash
git clone https://github.com/Dakar2024/Api-starter-Fastapi.git <projet>
cd <projet>
cp .env.example .env     # remplir SECRET_KEY, POSTGRES_*, ADMIN_*, MINIO_*
make up                  # API :8000 (/docs), Adminer :8080, MinIO :9001
```
Dev local : `make install` puis `make migrate` puis `make dev`.

## Anatomie d'une feature (pattern à suivre)
`features/<x>/` contient : `router.py` (routes HTTP) · `service.py` (**logique — à écrire**)
· `schemas.py` (Pydantic in/out) · `tables.py` (Piccolo) · `helpers.py` · `exceptions.py`
· `tasks.py` (Huey) · `piccolo_app.py` · `templates/` · `test_<x>.py`.
`core/` est partagé : `settings.py`, `database.py`, `exceptions.py`, `deps.py`
(`require_auth`, `get_current_user_id`), `mail.py`, `storage.py`, `worker.py`.

## Ajouter une feature
```bash
make feature name=clients     # génère le squelette
```
Puis : 1) implémenter `service.py` ; 2) enregistrer la table dans `core/database.py`
(`APP_REGISTRY`) ; 3) inclure le router dans `app.py` (`app.include_router(...)`) ;
4) `make migration app=clients`.

## Protéger une route
```python
from fastapi import APIRouter, Depends
from core.deps import require_auth
router = APIRouter(prefix="/clients", dependencies=[Depends(require_auth)])
```
`get_current_user_id` (dépendance) donne l'id de l'utilisateur courant.

## Règles
- Logique métier dans `service.py`, jamais dans `router.py`.
- Requêtes paramétrées, secrets via `settings`, montants recalculés serveur.
- Tests dans `features/<x>/test_<x>.py` (`make test`), écrits par `test-engineer`.

## Email
Le starter envoie les mails via `core/mail.py` (aiosmtplib). Pour utiliser **Resend**
(recommandé en prod), charge le skill `email-resend` : il ajoute un commutateur de provider
sans changer l'interface `send_email()`.

## Versions à jour (vérifiées 2026-10-17)
Le starter épingle peu de versions. Au clone, régénère depuis un `requirements.txt`
tenu à jour. Dernières versions stables : fastapi 0.143.x, pydantic 2.14.x,
pydantic-settings 2.16.x, piccolo 1.36.x, uvicorn 0.54.x, pytest 9.1.x, asyncpg 0.32.x.
Voir `docs-templates/DEPENDENCY-REPORT.md` du kit pour le détail et l'alerte sécurité
sur `python-jose`.
