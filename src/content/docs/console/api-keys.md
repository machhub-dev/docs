---
title: Developer Keys
description: Machine credentials (API keys) for non-interactive access to MACHHUB, and how they are scoped.
sidebar:
  order: 11
---

**Developer Keys** are machine credentials — API keys for non-interactive clients
(scripts, integrations, devices) that call the MACHHUB API without a
username/password login. They are listed under **Account → Developer Keys**.

An API key is sent on requests as:

```http
X-Machhub-Api-Key: mchx_<key><secret>
```

Keys carry scoped feature permissions, and the full key value is shown **once** at
creation — store it securely.

The list view shows each key's **Name**, **Expiration Date**, **Description**, and
**Status** (No Expiration / Valid / Expired).

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Developer Keys list at /account/developer_keys</strong>.</div>
</figure>

## Generating a key

Click **Add API Key** to open the generation dialog. Give the key a **Name**, an
optional **Expiration** and **Description**, and create it. The full `mchx_…` token is
displayed **once** — copy it immediately, as it cannot be retrieved again.

The same operation is available over the REST API:

```http
POST /api/api-key/generate
Authorization: Bearer <jwt>
```

See [Management API → API Keys](/api/management/) and
[API → Authentication](/api/authentication/).

:::note[Current build]
Generated keys currently receive **full access within their domain**, regardless of
any per-feature permissions. Scope each key by the domain it belongs to.
:::

## Related

- [Authentication](/concepts/authentication/) — JWT vs. API key
- [Authorization](/concepts/authorization/) — scoping a key's permissions
