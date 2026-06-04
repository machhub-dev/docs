---
title: API Keys
description: Machine credentials for non-interactive access to MACHHUB, and how they are scoped.
sidebar:
  order: 11
---

**API keys** are machine credentials for non-interactive clients (scripts,
integrations, devices) that call the MACHHUB API without a username/password login.
They are listed under **Account → API Keys**.

An API key is sent on requests as:

```http
X-Machhub-Api-Key: mchx_<key><secret>
```

Keys carry scoped feature permissions, and the full key value is shown **once** at
creation — store it securely.

The list view shows each key's **Name**, **Expiration Date**, **Description**, and
**Status** (No Expiration / Valid / Expired).

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>API Keys list at /account/api_keys</strong>.</div>
</figure>

:::caution[Generating keys: planned in the console]
In the current console build, the in-page **generate key** flow is **not yet
available**. You can create keys over the REST API today:

```http
POST /api/api-key/generate
Authorization: Bearer <jwt>
```

The response returns the full `mchx_…` token once. See
[Management API → API Keys](/api/management/) and
[API → Authentication](/api/authentication/).
:::

## Related

- [Authentication](/concepts/authentication/) — JWT vs. API key
- [Authorization](/concepts/authorization/) — scoping a key's permissions
