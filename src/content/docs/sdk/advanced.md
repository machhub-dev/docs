---
title: Advanced
description: Remote functions, flows and workflows, client-side caching, and data-transform helpers in the MACHHUB SDK.
sidebar:
  order: 10
---

Beyond collections, auth, tags, and the historian, the SDK exposes server-side
functions and flows, plus patterns for caching and transforming data on the client.

## Remote functions

Invoke a server-side function by name and inspect what's available:

```ts
// Invoke a named remote function with arguments
await sdk.function.invoke('sendEmail', {
  to: 'ops@example.com',
  subject: 'Threshold exceeded',
  body: 'Oven 1 over temperature.',
});

// List available functions
const functions = await sdk.function.list();
```

:::note[Functions vs. Processes]
`sdk.function.invoke(...)` calls a server function. For full **serverless functions**
with triggers, inputs, and outputs that you author and deploy, see
[Processes](/sdk/processes/) and [Authoring Processes](/processes/overview/).
:::

## Flows and workflows

Trigger a [Flow](/concepts/processes-and-flows/) (a Node-RED pipeline) or a workflow
by name:

```ts
await sdk.flow.execute('processOrder', { input: order, config: { retries: 2 } });
```

## Client-side caching

For read-heavy screens, a small TTL cache reduces round-trips. The pattern is a map
keyed by query plus a `getOrSet` helper:

```ts
class TTLCache {
  private store = new Map<string, { value: unknown; expires: number }>();
  constructor(private ttlMs = 30_000) {}

  async getOrSet<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = this.store.get(key);
    if (hit && hit.expires > Date.now()) return hit.value as T;
    const value = await load();
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}

const cache = new TTLCache();
const products = await cache.getOrSet('products:all', () =>
  sdk.collection('products').getAll(),
);
```

## Data-transform helpers

Shape data for tables, charts, and exports with small, framework-agnostic utilities —
for example grouping, sorting, paginating, and computing simple statistics:

```ts
function groupBy<T>(rows: T[], key: keyof T): Record<string, T[]> {
  return rows.reduce((acc, row) => {
    const k = String(row[key]);
    (acc[k] ??= []).push(row);
    return acc;
  }, {} as Record<string, T[]>);
}

function paginate<T>(rows: T[], page: number, size: number): T[] {
  return rows.slice((page - 1) * size, page * size);
}
```

## See also

- [Historian](/sdk/historian/) — time-series queries and CSV export.
- [Processes](/sdk/processes/) — invoking serverless functions.
- [Realtime](/sdk/realtime/) — tag subscriptions.
