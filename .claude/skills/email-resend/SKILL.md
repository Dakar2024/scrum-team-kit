---
name: email-resend
description: Use when wiring transactional email with Resend in a FastAPI or Litestar backend from the team's starters. Provides verified async config — settings, env vars, a provider-switch core/mail.py that keeps the existing send_email() interface, and usage. Both starters share the same core/, so this applies to both.
---

# Envoi de mails avec Resend (FastAPI & Litestar)

Ajoute Resend comme transport d'email dans le back-end, **sans casser** l'interface
existante : la fonction `core/mail.py::send_email(...)` garde la même signature, et un
réglage `EMAIL_PROVIDER` bascule entre le SMTP historique (aiosmtplib) et Resend. Les
helpers existants (`send_welcome_email`, reset password…) continuent de marcher.

Vérifié sur la doc officielle Resend (2026-10-17) : package `resend` (≥ 2.50.0, Python ≥ 3.7),
clé via `resend.api_key`, envoi async `await resend.Emails.send_async(params)` (nécessite
`resend[async]`), erreurs via `ResendError`. API : `POST https://api.resend.com/emails`.

## 1. Dépendance
Dans `requirements.txt`, ajouter (la variante `[async]` tire httpx pour l'envoi non bloquant) :
```
resend[async]
```

## 2. Variables d'environnement
`.env.example` (et le `.env` réel, jamais commité) :
```env
# Email : "smtp" (aiosmtplib, defaut) ou "resend"
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
# Expediteur verifie chez Resend ; format "Nom <adresse@domaine>"
MAIL_FROM=Acme <noreply@mondomaine.tld>
```
> Le domaine de `MAIL_FROM` doit être **vérifié dans Resend** (DNS) pour la prod.
> `onboarding@resend.dev` est utilisable pour tester.

## 3. Settings (`core/settings.py`, pydantic-settings)
Ajouter les champs :
```python
from typing import Literal

class Settings(BaseSettings):
    # ... champs existants ...
    EMAIL_PROVIDER: Literal["smtp", "resend"] = "smtp"
    RESEND_API_KEY: str | None = None
    MAIL_FROM: str = "noreply@example.com"
```

## 4. `core/mail.py` — transport à provider commutable
Garde la signature `send_email(...)` attendue par les helpers. N'écris jamais la clé en dur.
```python
"""Email transport. Switches between SMTP (aiosmtplib) and Resend via settings."""
from __future__ import annotations

import resend
from core.settings import settings

# Configure the Resend SDK once, only if selected and a key is present.
if settings.EMAIL_PROVIDER == "resend" and settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


async def send_email(
    *,
    to: str | list[str],
    subject: str,
    html: str,
    text: str | None = None,
    cc: str | list[str] | None = None,
    bcc: str | list[str] | None = None,
    reply_to: str | list[str] | None = None,
) -> None:
    """Send a transactional email with the configured provider.

    Keeps a stable interface so feature helpers don't depend on the provider.
    """
    if settings.EMAIL_PROVIDER == "resend":
        await _send_resend(
            to=to, subject=subject, html=html, text=text,
            cc=cc, bcc=bcc, reply_to=reply_to,
        )
    else:
        await _send_smtp(
            to=to, subject=subject, html=html, text=text,
            cc=cc, bcc=bcc, reply_to=reply_to,
        )


async def _send_resend(
    *, to, subject, html, text, cc, bcc, reply_to
) -> None:
    """Send via Resend's async API. Raises resend.exceptions.ResendError on failure."""
    params: resend.Emails.SendParams = {
        "from": settings.MAIL_FROM,
        "to": [to] if isinstance(to, str) else to,
        "subject": subject,
        "html": html,
    }
    if text is not None:
        params["text"] = text
    if cc:
        params["cc"] = [cc] if isinstance(cc, str) else cc
    if bcc:
        params["bcc"] = [bcc] if isinstance(bcc, str) else bcc
    if reply_to:
        params["reply_to"] = [reply_to] if isinstance(reply_to, str) else reply_to

    await resend.Emails.send_async(params)


async def _send_smtp(*, to, subject, html, text, cc, bcc, reply_to) -> None:
    """Existing aiosmtplib transport (keep the starter's implementation here)."""
    # ... conserver le code aiosmtplib d'origine du starter ...
    raise NotImplementedError
```
> Garde la vraie implémentation SMTP du starter dans `_send_smtp`. Si tu passes 100 %
> Resend, tu peux retirer SMTP, mais le commutateur évite d'être bloqué si Resend tombe.

## 5. Usage (inchangé pour les features)
```python
# features/<x>/helpers.py
from core.mail import send_email

async def send_welcome_email(to_email: str, name: str) -> None:
    await send_email(
        to=to_email,
        subject=f"Bienvenue — {settings.APP_NAME}",
        html=_render("welcome.html", name=name),  # template Jinja2 existant
    )
```

## 6. Erreurs & gestion
- `resend.Emails.send_async` lève `resend.exceptions.ResendError` (clé invalide, domaine non
  vérifié, payload refusé). Attrape-la là où l'échec d'email ne doit pas casser la requête
  (ex. envoi via une tâche Huey `features/<x>/tasks.py`, déjà le pattern des starters).
- Idempotence : pour éviter un double envoi, Resend accepte un header `Idempotency-Key`
  (unique, expire après 24 h).

## 7. Vérifier que ça marche
```bash
# Dans un shell du projet, EMAIL_PROVIDER=resend et RESEND_API_KEY en .env
python -c "import asyncio, resend; from core.settings import settings; \
resend.api_key=settings.RESEND_API_KEY; \
print(asyncio.run(resend.Emails.send_async({'from':settings.MAIL_FROM,'to':['delivered@resend.dev'],'subject':'test','html':'<b>ok</b>'})))"
```
`delivered@resend.dev` est l'adresse de test Resend ; la réponse contient un `id`.
