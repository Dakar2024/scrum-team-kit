---
name: security-audit
description: Use when the pentester agent audits this team's own code for vulnerabilities. Defensive OWASP Top 10 / API Security Top 10 checklist tailored to the team's stack (FastAPI/Litestar, Piccolo, JWT cookie, React). Review-only; reports findings with severity and remediation.
---

# Audit de sécurité (défensif)

Cadre de l'audit mené par l'agent `pentester` sur le code **du projet de l'équipe
uniquement**. Pas de cible externe, pas d'exploitation en production, pas de test
contre des systèmes tiers. Revue de code et vérification de configuration.

## Checklist OWASP API Security Top 10 (adaptée à la stack)
| # | Risque | À vérifier dans ce code |
|---|---|---|
| API1 | Broken Object Level Auth (IDOR) | Chaque accès à une ressource filtre bien sur l'utilisateur courant (`get_current_user_id` / guard) |
| API2 | Broken Authentication | JWT : algo fixé (pas `none`), expiration, cookie `httpOnly`+`SameSite`; hachage Argon2 |
| API3 | Excessive Data Exposure | Les réponses renvoient des schémas `*Response` restreints, pas la table brute (ex: jamais `hashed_password`) |
| API3 | Mass Assignment | Les schémas d'entrée n'acceptent pas des champs sensibles (`role`, `is_admin`) depuis le client |
| API4 | Rate limiting | slowapi / RateLimitConfig actif ; endpoints sensibles protégés |
| API5 | Broken Function Level Auth | Les routes admin exigent le rôle ; pas de route privilégiée sans guard |
| API8 | Injection | Requêtes **paramétrées** (Piccolo), pas de f-string SQL ; pas de SSTI dans les templates email ; entrées validées par Pydantic |
| API8 | CORS | `allow_origins` restreint (pas `*` avec credentials) |
| — | Secrets | `.env` hors du repo, pas de clé en dur, pas de secret dans les logs |
| — | Dépendances | Pas de version vulnérable connue (voir `docs-templates/DEPENDENCY-REPORT.md`) |
| — | Transport | HTTPS en prod ; API jamais exposée publiquement (Traefik route `/api`) |

## Point de vigilance connu sur la stack
- **`python-jose`** (utilisé par les starters pour le JWT) a des vulnérabilités connues
  d'*algorithm confusion* et de DoS (voir le rapport de dépendances du kit). Recommander
  la bascule vers **`PyJWT`** ou, a minima, forcer l'algorithme attendu et refuser `none`.
- Le middleware `guardMiddleware` du starter front ne fait que logger — la vraie garde
  d'auth doit être posée côté serveur (route layout protégé + cookie vérifié par l'API).

## Format d'un finding
```
[HAUTE] features/users/service.py:42 — /users/me renvoie l'objet User complet
Impact: fuite du hash de mot de passe et des champs internes.
Remédiation: mapper vers UserResponse (email, full_name, role) avant de renvoyer.
```
Classer par sévérité décroissante. Remonter au dev concerné + Scrum Master. Ne pas
corriger soi-même ; proposer le patch, le dev l'applique.

## Aller plus loin (optionnel, non installé par défaut)
Le dépôt `https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git` (Apache-2.0)
contient des skills détaillés par vulnérabilité (IDOR, BOLA, JWT, SQLi, SSTI, secret
scanning, durcissement Docker...). Ils embarquent des scripts Python exécutables : à
installer manuellement dans `.claude/skills/` après revue, pas inclus ici par précaution.
