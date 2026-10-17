---
name: starter-litestar
description: Use when starting or extending a Litestar backend for this team. Explains how to begin from the api-starter-Litestar repo (feature-based, Piccolo, PostgreSQL, MinIO, Huey, JWT cookie auth, Controller pattern) instead of scaffolding from scratch.
---

# Starter Litestar

Point de départ obligatoire pour toute API Litestar de l'équipe. **Ne jamais repartir
de zéro**. Même philosophie que le starter FastAPI, mais routes en **Controller** et
auth par **guard**.

Dépôt : `https://github.com/Dakar2024/api-starter-Litestar.git`

## Stack du starter
Litestar (async, OpenAPI via Scalar) · Piccolo + asyncpg + PostgreSQL 16 · MinIO ·
Huey + Redis · Auth JWT cookie httpOnly + Argon2 · Pydantic v2 · rate limit 60/min ·
Gunicorn + Uvicorn en prod · Pytest.

## Démarrer un projet
```bash
git clone https://github.com/Dakar2024/api-starter-Litestar.git <projet>
cd <projet>
cp .env.example .env     # remplir SECRET_KEY, POSTGRES_*, ADMIN_*, MINIO_*
make up                  # API :8000 (/docs), Adminer :8080, MinIO :9001
```
Dev local : `make install` puis `make migrate` puis `make dev`.

## Anatomie d'une feature
`features/<x>/` : `controller.py` (routes) · `service.py` (**logique — à écrire**) ·
`schemas.py` · `tables.py` (Piccolo) · `helpers.py` · `exceptions.py` · `piccolo_app.py`
· `templates/` · `test_<x>.py`. `core/` partagé : `settings.py`, `database.py`,
`exceptions.py`, `guards.py` (`auth_guard`), `mail.py`, `storage.py`.

## Ajouter une feature
```bash
make feature name=clients
```
Puis : 1) implémenter `service.py` ; 2) table dans `core/database.py` (`APP_REGISTRY`) ;
3) enregistrer le controller dans `app.py` (`route_handlers=[..., ClientsController]`) ;
4) `make migration app=clients`.

## Protéger une route
```python
from litestar import Controller, get
from core.guards import auth_guard

class MyController(Controller):
    guards = [auth_guard]          # tout le controller

    @get("/secret", guards=[auth_guard])
    async def secret(self) -> dict: ...
```

## Règles
Identiques au starter FastAPI : logique en `service.py`, requêtes paramétrées, secrets
via `settings`, montants recalculés serveur, tests écrits par `test-engineer` (`make test`).

## Versions à jour (vérifiées 2026-10-17)
litestar 2.24.x, piccolo 1.36.x, pydantic 2.14.x, asyncpg 0.32.x, uvicorn 0.54.x,
pytest 9.1.x. Voir `docs-templates/DEPENDENCY-REPORT.md` (alerte sécurité `python-jose`).
