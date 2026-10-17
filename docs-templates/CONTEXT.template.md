# `<NomDuProjet>` — Contexte & guide d'implémentation

> **Template réutilisable.** Copie ce fichier à la racine d'un nouveau projet sous le nom
> `CONTEXT.md`, puis remplace tous les `<...>` et complète la liste des *features*. Il décrit
> l'**architecture standard** (identique à tous mes projets) ; seul le **métier** change d'un
> projet à l'autre.
>
> **À lire en premier.** La **structure** (dossiers, tables, routes, schémas, câblage,
> compose/Traefik) doit être posée en premier ; les **services métier** restent des **stubs**
> (`raise NotImplementedError`) — c'est ce qui se code ensuite.

---

## 1. Objectif

`<Une phrase : à qui sert l'app et ce qu'elle fait.>`

Fonctions principales :
1. `<feature 1 — ex. tableau de bord / statistiques>`
2. `<feature 2>`
3. `<feature 3>`
4. **Authentification** + `<gestion des accès / invitations si besoin>`

Domaine de prod : **`<domaine.tld>`**.

---

## 2. Stack & architecture (standard — ne change pas)

| Couche | Techno |
|---|---|
| **API** (`/api`) | Litestar (Python) + Piccolo ORM + asyncpg + PostgreSQL |
| Stockage fichiers | MinIO (S3-compatible) — PDF, images, avatars… |
| Tâches de fond | Huey + Redis (emails, jobs asynchrones) |
| Auth | JWT en **cookie httpOnly** (`access_token`) |
| **Front** (`/web`) | TanStack Start / Router (SSR, Bun), Tailwind + shadcn/ui, Lingui i18n, jotai, TanStack Query, sonner |
| Reverse proxy (prod) | **Traefik** (HTTPS auto Let's Encrypt) |

**Principe prod : l'API n'est JAMAIS exposée.** Seul le front (`<domaine.tld>`) est public ;
Traefik route `<domaine.tld>/api/*` → conteneur `api` en interne (préfixe `/api` retiré).
Côté front, **tous les appels visent `/api/...`** (même origine).

### Arborescence
```
<projet>/
├── compose.yml            # base (services, réseaux, volumes)
├── compose.dev.yml        # DEV : ports exposés + hot-reload API + Adminer
├── compose.prod.yml       # PROD : Traefik, API non exposée, <domaine.tld>
├── traefik/
│   ├── traefik.yml         # config statique Traefik
│   └── acme.json           # certs Let's Encrypt (chmod 600 ; vide au départ)
├── .env.example            # variables (copier en .env)
├── api/                    # Litestar + Piccolo
│   ├── app.py              # point d'entrée (controllers enregistrés)
│   ├── core/               # settings, database, storage(MinIO), mail, worker, guards, exceptions
│   └── features/
│       ├── auth/           # register/login/me/logout/profil/reset password
│       └── <feature>/      # une par domaine métier (voir pattern §2.1)
└── web/                    # TanStack Start — routing par GROUPES sous $lang
    └── src/
        ├── app/$lang/
        │   ├── _panel/                       # groupe PROTÉGÉ — layout + garde d'auth
        │   │   ├── route.tsx                  # createFileRoute('/$lang/_panel') : layout + Outlet + garde
        │   │   ├── (pages)/                   # (…) = groupe sans segment d'URL → /$lang/<feature>
        │   │   │   ├── <feature>.tsx          #   feature simple = fichier
        │   │   │   └── <feature>/index.tsx    #   feature = dossier (+ $id/ pour le détail)
        │   │   ├── -components/               # composants du panel (sidebar…) — préfixe - = pas une route
        │   │   ├── requests/                  # <feature>-requests.ts (+ index.ts) — fetch brut
        │   │   ├── hooks/                     # use<Feature>.ts — TanStack Query + toast
        │   │   └── stores/                    # atoms d'état (jotai)
        │   └── _auth/                         # groupe AUTH
        │       ├── route.tsx                  # createFileRoute('/$lang/_auth')
        │       ├── (pages)/                   # sign-in.tsx, join.tsx (accepter invitation)…
        │       ├── -components/
        │       ├── requests/                  # auth-requests.ts (+ index.ts)
        │       ├── hooks/                     # useAuth : useMe, useLoginMutation, useLogoutMutation…
        │       └── stores/                    # auth-atoms.ts : userAtom, isAuthenticatedAtom
        └── shared/                            # transverse : lib/http-client, components/ui, providers
```

### 2.1 Pattern d'une feature **backend**
`tables.py` (modèle Piccolo) · `schemas.py` (pydantic in/out) · `service.py` (**logique — à écrire**)
· `controller.py` (routes Litestar, branchées dans `app.py`) · `piccolo_app.py` (enregistre la table
dans `core/database.py`).

### 2.2 Pattern d'une feature **front** (chaîne de données)
`requests/<feature>-requests.ts` (fetch brut vers `/api/...`) → `hooks/use<Feature>.ts`
(**TanStack Query** : `useQuery`/`useMutation`, query keys, `toast` via sonner, invalidation) →
**la Page consomme le hook** (jamais le request directement). État global via **jotai** (`stores/`).
Le layout `_panel/route.tsx` porte la **garde d'auth** et redirige vers
`/$lang/_auth/(pages)/sign-in` si non connecté. Composants non-routés préfixés `-`. Alias `@/` → `src/`.

---

## 3. Modèles de données `<à définir par projet>`
- **`<Entité>`** : `id, <champs>, created_by→User, created_at`.
- **User** (starter) : auth (email, hash, rôle…).
- `<autres entités…>`

---

## 4. Endpoints — pattern REST par feature
```
POST /api/auth/register     POST /api/auth/login     GET /api/auth/me     POST /api/auth/logout
GET  /api/<feature>/        POST /api/<feature>/
GET  /api/<feature>/{id}    PATCH /api/<feature>/{id}    DELETE /api/<feature>/{id}
# actions spécifiques : POST /api/<feature>/{id}/<action>
```

---

## 5. Lancer le projet

**Prérequis** : Docker. Copier `.env.example` → `.env` (SECRET_KEY, mots de passe DB,
MinIO keys, SMTP, `DOMAIN=<domaine.tld>`…).

**Dev**
```bash
docker compose -f compose.yml -f compose.dev.yml up -d --build
# API http://localhost:8000 (docs /docs) · Front http://localhost:3000
# Adminer http://localhost:8080 · MinIO console http://localhost:9001
# Front hot-reload hors Docker : cd web && bun install && bun dev
```

**Migrations Piccolo** (depuis `api/`, cf. Makefile)
```bash
make migration app=<feature>     # génère la migration --auto
make migrate                     # applique toutes les migrations
```

**Prod** (VPS, DNS `<domaine.tld>` → IP du serveur)
```bash
docker network create traefik-public                 # une fois
touch traefik/acme.json && chmod 600 traefik/acme.json
docker compose -f compose.yml -f compose.prod.yml up -d --build
```
DNS à créer : `<domaine.tld>`, `media.<domaine.tld>`, `console.<domaine.tld>`, `traefik.<domaine.tld>`
→ IP du serveur. `TRAEFIK_AUTH` = `htpasswd -nb admin '<mdp>'` (échapper `$`→`$$` dans `.env`).

---

## 6. Conventions
- Suivre le pattern de `features/auth/` (Controller + Service + schémas pydantic + table Piccolo).
- Cookie auth via `core/guards.py::auth_guard` (appliqué aux controllers) ; `_user_id(request)`
  décode le cookie pour l'utilisateur courant.
- Réponses = schémas pydantic `*Response`. Dates en `.isoformat()`.
- Front : appels via `handleHttpRequest` (`@/lib/http-client`) vers `/api/...` (même origine).
- **Ne jamais** exposer l'API publiquement ; **ne jamais** renvoyer le token dans le body (cookie only).
- Recalculer les montants/totaux **côté serveur** (ne pas faire confiance au client).

---

## 7. Suivi — `<FAIT vs À FAIRE>`
Lister ici, par feature, ce qui est en place (structure) et les `raise NotImplementedError` à écrire.
- [ ] `features/auth/service.py`
- [ ] `features/<feature>/service.py`
- [ ] Front `app/$lang/_panel/(pages)/<feature>/`
- [ ] …
