# Rapport de vérification des starters — 2026-10-17

Vérification des 3 starters contre les registres officiels (PyPI, npm) et la base de
vulnérabilités OSV. **Conclusion : les back-ends sont globalement à jour ; le front
React/TanStack a plusieurs retards majeurs ; une dépendance back-end est vulnérable.**

## 1. Back-end FastAPI & Litestar — à jour, sauf un point sécurité

Dernières versions stables PyPI (date de publication) :

| Paquet | Dernière stable | Publiée |
|---|---|---|
| fastapi | 0.143.3 | 2026-10-16 |
| litestar | 2.24.0 | 2026-06-11 |
| piccolo | 1.36.0 | 2026-07-27 |
| pydantic | 2.14.1 | 2026-10-11 |
| pydantic-settings | 2.16.0 | 2026-10-14 |
| uvicorn | 0.54.0 | 2026-09-25 |
| asyncpg | 0.32.0 | 2026-10-06 |
| pytest | 9.1.1 | 2026-06-19 |
| huey | 3.4.0 | 2026-09-04 |

Les `requirements.txt` des starters n'épinglent pas les versions (pas de `==`), donc un
`pip install` récupère déjà ces versions. **Recommandation** : épingler les versions
(`==`) ou passer à **uv** avec un lock, pour des builds reproductibles.

### ⚠️ Vulnérabilité : `python-jose`
Les deux starters utilisent `python-jose[cryptography]` pour le JWT. OSV remonte
plusieurs CVE **non corrigées** sur ce paquet, dont :
- *algorithm confusion* (contournement du garde via clé publique encodée en DER) —
  `GHSA-3qf3-8w2g-rqmx` / `PYSEC-2026-4298` ;
- *algorithm confusion* avec clés OpenSSH ECDSA — `GHSA-6c5p-j8vq-pqhj` ;
- DoS via contenu JWE compressé — `GHSA-cjwg-qfpm-7377` ;
- comparaison HMAC non constante — `GHSA-w799-prg3-cx77`.

**Action recommandée** (à porter par `devops` + `pentester`) : migrer vers **`PyJWT`**
(2.15.x, maintenu), ou à défaut forcer explicitement l'algorithme attendu et refuser
`alg: none` partout où un token est décodé.

## 2. Front-end React + TanStack — retards majeurs

Comparaison `package.json` vs dernières versions npm :

| Paquet | Dans le starter | Dernière | Type |
|---|---|---|---|
| @lingui/* | ^5.7.0 | 6.10.0 | **MAJEUR** |
| jotai | ^2.16.0 | 3.0.1 | **MAJEUR** |
| ky | ^1.14.1 | 2.2.0 | **MAJEUR** |
| vite | ^7.1.7 | 8.3.4 | **MAJEUR** |
| vitest | ^3.0.5 | 5.0.5 | **MAJEUR** |
| typescript | ^5.7.2 | 7.0.2 | **MAJEUR** |
| jsdom | ^27.0.0 | 30.1.3 | **MAJEUR** |
| @vitejs/plugin-react | ^5.0.4 | 6.1.2 | **MAJEUR** |
| @types/node | ^22.10.2 | 26.6.5 | **MAJEUR** |
| vite-tsconfig-paths | ^5.1.4 | 6.1.1 | **MAJEUR** |
| lucide-react | ^0.544.0 | 1.59.0 | **MAJEUR** |
| web-vitals | ^5.1.0 | 6.2.3 | **MAJEUR** |
| @tanstack/* | ^1.141.x | ~1.169.x | mineur (sûr) |
| react / react-dom | ^19.2.0 | 19.3.1 | mineur (sûr) |
| tailwindcss | ^4.0.6 | 4.3.3 | mineur (sûr) |

**Recommandation** : mettre à jour **progressivement**, un bump majeur à la fois, en
lançant les tests après chaque. Prioriser `typescript`, `vite`/`vitest` (chaîne de build)
et `ky` (client HTTP, changement d'API possible). `nitro: "latest"` est à épingler.

## Comment ce rapport a été produit
- PyPI : `GET https://pypi.org/pypi/<pkg>/json` → `info.version`.
- npm : `GET https://registry.npmjs.org/<pkg>/latest` → `version`.
- Vulnérabilités : `POST https://api.osv.dev/v1/query` avec `{package:{name, ecosystem}}`.
Rejouer le contrôle avant chaque nouveau projet pour rafraîchir ces chiffres.
