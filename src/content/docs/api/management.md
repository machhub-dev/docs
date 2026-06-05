---
title: Management API
description: The /api/* management surface — home, license, domains, groups, users, API keys, the UNS, collections, settings, and logs.
sidebar:
  order: 4
---

The `/api/*` surface is the **management plane** used by the web console: domains,
users, groups, API keys, the [Unified Namespace](/concepts/unified-namespace/),
[Collection](/concepts/collections/) schemas, settings, and licensing. Most routes
require authentication and read the [`Domain`](/api/data-plane/#the-domain-header)
header. Only `GET /api/home` is reachable before login; license status and trial
activation require authentication but skip the per-feature permission and license
checks.

:::caution[Permission enforcement varies in the current build]
Authentication (`VerifyAuth`) is applied to the `/api/*` group, but several
per-route permission checks are disabled in the current build, and the home/license
routes are intentionally pre-auth. See
[Conventions & errors](/api/errors/#security) and verify enforcement for your
deployment.
:::

## Home

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/home` | Dashboard counters: total users, groups, tags, and license status |

## License

`GET /api/license` and `POST /api/license/activate/trial` require authentication but
skip the permission/license checks; the remaining routes are permission-gated. See
[Licensing](/concepts/licensing/) for the activation flow.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/license` | Current license status |
| `POST` | `/api/license/activate/trial` | Activate a trial license |
| `POST` | `/api/license/generate/activation` | Generate an activation request (from your key + machine fingerprint) |
| `POST` | `/api/license/generate/deactivation` | Generate a deactivation request |
| `POST` | `/api/license/activate` | Upload and activate a signed `.mpl` license file |
| `POST` | `/api/license/deactivate` | Deactivate the license |
| `POST` | `/api/license/deactivate/trial` | Deactivate the trial license |

## Domains & applications

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/domain` | List all [domains](/concepts/domains/) |
| `GET` | `/api/domain/with-groups` | List domains with their groups |
| `POST` | `/api/domain` | Create an application domain |
| `DELETE` | `/api/domain/:id` | Delete a domain |
| `GET` | `/api/application` | List application (non-system) domains |

## Groups

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/group` | List the domain's groups with their users |
| `POST` | `/api/group` | Create a group |
| `PATCH` | `/api/group` | Edit a group |
| `GET` | `/api/group/:id` | Get one group |
| `DELETE` | `/api/group/:groupID` | Delete a group |

## Users

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/users/` | List users |
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/users/:id` | Get one user |
| `POST` | `/api/users/:id/password-reset` | Reset a user's password |
| `PATCH` | `/api/users` | Edit a user's profile fields |
| `DELETE` | `/api/users/:userID` | Delete a user |
| `GET` | `/api/user/image` | Get the current user's image |
| `GET` | `/api/users/image/:id` | Get a specific user's image |

## API keys

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/api-key/generate` | Generate a new API key (returns the `mchx_` token once) |
| `GET` | `/api/api-key/` | List the domain's API keys |
| `DELETE` | `/api/api-key/delete/:id` | Delete an API key |

Generating a key takes a name, optional expiration, description, and the
feature/action/scope permissions to embed:

```http
POST /api/api-key/generate
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "name": "ingest-bot",
  "expiration": 0,
  "description": "Edge ingest service",
  "features": [
    { "name": "collections", "action": "read-write", "scope": "all" }
  ]
}
```

The full key (prefix `mchx_`) is returned in the `token` field and shown **once** —
present it on later requests via `X-Machhub-Api-Key`. See
[Authentication](/api/authentication/).

:::note[Current build]
Generated keys currently receive **full access within their domain** regardless of
the `features` permissions supplied in the request. Treat every API key as a
domain-wide credential and scope it by domain.
:::

## Unified Namespace (UNS)

### Namespace

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/uns/namespace` | List namespaces |
| `GET` | `/api/uns/namespace/tags` | List all tags |
| `GET` | `/api/uns/namespace/folder` | List all folders |
| `POST` | `/api/uns/namespace` | Create a namespace |
| `PATCH` | `/api/uns/namespace/level` | Edit a namespace level (folder/tag node) |
| `DELETE` | `/api/uns/namespace/:id` | Delete a namespace |

### Forwarding rules

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/uns/namespace/forwarding_rule` | Create a [forwarding rule](/console/namespace/) |
| `DELETE` | `/api/uns/namespace/forwarding_rule/:id` | Delete a forwarding rule |

### Historize

| Method | Path | Purpose |
| --- | --- | --- |
| `PUT` | `/api/uns/historize/list` | List historized tags |
| `PATCH` | `/api/uns/historize` | Query historized data for a topic/range |
| `POST` | `/api/uns/historize` | Update a tag's historize configuration |
| `POST` | `/api/uns/historize/export` | Export historized data (topics, date range, timezone) |

### Upstreams

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/uns/upstream` | List [upstreams](/console/upstreams/) |
| `POST` | `/api/uns/upstream` | Create an upstream (connects to a remote broker) |
| `PUT` | `/api/uns/upstream` | Edit an upstream (and connect/disconnect) |
| `DELETE` | `/api/uns/upstream/:id` | Delete an upstream |

## Collections

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/collection` | List all collection schemas |
| `GET` | `/api/collection/:id` | Get one collection schema |
| `POST` | `/api/collection` | Create a collection |
| `PUT` | `/api/collection` | Edit a collection |
| `DELETE` | `/api/collection/:id` | Delete a collection |
| `GET` | `/api/collection/data/:id` | List records in a collection |
| `POST` | `/api/collection/data/:id` | Add a record to a collection |
| `DELETE` | `/api/collection/data/:id` | Delete a record |

:::note[Schema vs. data]
`/api/collection/*` manages collection **schemas** (and console-side record editing),
while the SDK reads and writes records through the
[data plane](/api/data-plane/#records-generic-crud) at `/machhub/:table_name`.
:::

## Settings

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/settings` | Get general settings |
| `POST` | `/api/settings` | Update general settings (device name, metadata path) |

## Logs

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/logs/` | Query platform logs by `startDate` / `endDate` |

## Related

- API: [Authentication](/api/authentication/), [Data plane](/api/data-plane/),
  [Conventions & errors](/api/errors/)
- Console: [Groups & permissions](/console/groups/),
  [Manage the UNS](/console/namespace/), [Settings](/console/settings/)
