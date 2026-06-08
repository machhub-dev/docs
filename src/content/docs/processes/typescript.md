---
title: TypeScript processes
description: Writing a serverless Process in TypeScript — the execute(context) body, the injected SDK, and HTTP triggers.
sidebar:
  order: 4
---

A TypeScript [Process](/concepts/processes-and-flows/) is a serverless function whose
body you write as an `execute(context)` function. The platform runs it in an isolated
per-domain worker.

## The shape

```ts
async function execute(context: ProcessContext): Promise<any> {
  const { inputs, trigger } = context;
  // your logic here
  return { ok: true };
}
```

- `context.inputs` — the resolved [inputs](/processes/model/) (tag values, SQL results).
- `context.trigger` — information about what triggered this run.

## The injected SDK

Inside a TypeScript process, the MACHHUB SDK is available as a **global `sdk`** — there
is **no import and no initialization** to do:

```ts
async function execute(context: ProcessContext): Promise<any> {
  // Read records directly — `sdk` is injected.
  const readings = await sdk.collection('myapp.readings').getAll();

  const avg =
    readings.reduce((sum, r) => sum + Number(r.value), 0) / (readings.length || 1);

  // You can also publish a tag, write records, etc.
  await sdk.tag.publish('myapp/readings/avg', avg);

  return { count: readings.length, avg };
}
```

This is the main advantage of TypeScript processes over [Python](/processes/python/):
full SDK access (collections, tags, historian) from inside the function.

## HTTP triggers

If the process has an `http` trigger, its JSON request body is merged into
`context.inputs`, and it is reachable at:

```http
POST /process/<slug>
Content-Type: application/json

{ "field": "value" }
```

```ts
async function execute(context: ProcessContext): Promise<any> {
  const { field } = context.inputs; // came from the HTTP body
  return { received: field };
}
```

## Tag-change triggers

A `tag_change` trigger does **not** automatically inject the new value. Add a **tag
input** so the value appears in `context.inputs`. See [the Process model](/processes/model/).

## Deploy & invoke

Author and deploy from the [MACHHUB Designer](/designer/overview/); invoke from an app
with [`sdk.processes.execute`](/sdk/processes/). See [Invoking processes](/processes/invoking/).
