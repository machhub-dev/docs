---
title: Invoking processes
description: Run a MACHHUB process from an app via the SDK or HTTP, stream its logs, and manage per-domain packages.
sidebar:
  order: 5
---

Once a [Process](/concepts/processes-and-flows/) is deployed, you can run it on demand
from your application, or let its [triggers](/processes/model/) run it automatically.

## From the SDK

```ts
const result = await sdk.processes.execute('computeAverage', { window: '1h' });
```

See [SDK → Processes](/sdk/processes/) for the full client API
(`getProcesses`, `changeTriggers`).

## Over HTTP

Two HTTP forms are available:

```http
POST /machhub/processes/execute
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "computeAverage", "input": { "window": "1h" } }
```

The Bearer token is read from `localStorage['machhub_token']` in browser clients.

For a process with an **HTTP trigger**, you can also call its slug endpoint directly,
with the JSON body merged into the process inputs:

```http
POST /process/<slug>
Content-Type: application/json

{ "window": "1h" }
```

## Import / export

Processes can be exported and imported as JSON (snake_case keys). Runtime-managed
fields such as `enabled`, `log_enabled`, `version`, `id`, and `domain_id` are not part
of the exported definition.

## Streaming logs

While a process runs, its logs can be streamed over WebSocket — useful during
development:

```
ws://<host>/ws/processes/<id>/logs
```

## Packages

Each domain's worker has its own dependency set. Add the `pip` (Python) or `npm`
(TypeScript) packages your process code needs, per domain.

## Related

- [The Process model](/processes/model/)
- [TypeScript processes](/processes/typescript/) · [Python processes](/processes/python/)
