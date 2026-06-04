---
title: Authentication
description: How MACHHUB verifies who you are — EdDSA-signed JWTs from POST /auth/login, Authorization Bearer tokens, mchx_ API keys, Argon2id password hashing, and re-login on expiry (no refresh tokens).
sidebar:
  order: 9
---

**Authentication** answers *who is making this request*. MACHHUB supports two
credentials: a short-lived **JWT** for interactive sessions (the console, your apps)
and a long-lived **API key** for machine-to-machine access. Both are verified by the
`VerifyAuth` middleware before any handler runs.

## Logging in: `POST /auth/login`

A user authenticates with a username and password. On success, MACHHUB returns an
**EdDSA-signed JWT** in the `tkn` field:

```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{ "username": "admin", "password": "••••••••" }
```

```json
{ "success": true, "tkn": "eyJhbGciOiJFZERTQSIsImtpZCI6..." }
```

The token's claims carry the user's identity, groups, and domains, plus standard JWT
registered claims (`iss`, `aud`, `exp`, `iat`, …). It is signed with **EdDSA**
(Ed25519) using the server's private key, and includes a **`kid`** header that must
match the server's configured key ID.

## Using the token: `Authorization: Bearer`

Send the JWT on subsequent requests in the `Authorization` header with the `Bearer`
scheme:

```http
GET /api/uns/namespace HTTP/1.1
Authorization: Bearer eyJhbGciOiJFZERTQSIsImtpZCI6...
Domain: domains:machhub_admin
```

`VerifyAuth` validates the signature against the server's **public key**, and checks
the issuer, required audience, and that the `kid` matches:

```go
opts := []jwt.ParserOption{
    jwt.WithAudience(cfg.Auth.ReqAudience),
    jwt.WithIssuer(cfg.Auth.Issuer),
    jwt.WithIssuedAt(),
    jwt.WithValidMethods([]string{"EdDSA"}), // only EdDSA is accepted
}
// the key callback also requires tkn.Header["kid"] == cfg.Auth.KeyID
```

The keys, issuer, audiences, key ID, and token lifetime are all set in the
[`auth` configuration](/install/configuration/).

## API keys: `X-Machhub-Api-Key: mchx_…`

For scripts, integrations, and services, MACHHUB issues **API keys**. They are sent
in their own header:

```http
GET /machhub/production/all HTTP/1.1
X-Machhub-Api-Key: mchx_AbC123dEf456...
Domain: domains:machhub_admin
```

API keys always begin with the **`mchx_`** prefix. Internally a key is
`mchx_` + a 12-character lookup id + a random secret; only the lookup id is stored in
clear, while the secret is hashed (see below). A key is created with a name, an
expiration, and a set of [permissions](/concepts/authorization/) — so an integration
can be granted exactly the access it needs. See
[SDK API Keys](/console/api-keys/) for generating and using them.

```mermaid
flowchart TB
  Req["Incoming request"]
  Req --> HasJWT{"Authorization:\nBearer?"}
  HasJWT -- yes --> JWT["Validate EdDSA JWT\n(iss, aud, kid, exp)"]
  HasJWT -- no --> HasKey{"X-Machhub-Api-Key:\nmchx_...?"}
  HasKey -- yes --> Key["Look up key id,\nverify hashed secret"]
  HasKey -- no --> Deny["401 Unauthorized"]
  JWT --> OK["Authenticated\n(set user id)"]
  Key --> OK
```

:::caution
A request must present **either** a `Bearer` JWT **or** an `X-Machhub-Api-Key`. If
neither is present (on a protected route) the request is rejected with `401`.
:::

## Password and key hashing: Argon2id

User passwords and the secret half of API keys are hashed with **Argon2id** before
storage. MACHHUB never stores a plaintext password or a full API key — only the
Argon2id hash, with parameters (memory, iterations, parallelism, salt/key length) set
in the [`argon2` configuration](/install/configuration/):

```
$argon2id$v=19$m=65526,t=2,p=2$<salt>$<hash>
```

## No refresh tokens

MACHHUB JWTs are **short-lived** and there are **no refresh tokens**. The token
lifetime is the `auth.ttl` value (in hours; default 24). When a token expires, the
client simply **logs in again** via `POST /auth/login` to obtain a fresh one.

:::tip
Because there is no refresh flow, use an **API key** for long-running, unattended
processes rather than trying to keep a user JWT alive.
:::

Once MACHHUB knows *who* you are, it decides *what you may do* — continue with
[Authorization & Permissions](/concepts/authorization/).
