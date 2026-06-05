---
title: Authoring Processes
description: The Process model — triggers, inputs, outputs, the execute(context) body, supported languages, and how to deploy and invoke serverless functions on MACHHUB.
sidebar:
  order: 1
---

A **Process** is a **serverless function** that runs on MACHHUB. You write the
function body; the platform handles scheduling, input resolution, execution in an
isolated worker, and applying outputs. (Processes are a different feature from
[Flows](/concepts/processes-and-flows/), which are Node-RED.)

## The model

```mermaid
flowchart LR
  T["Trigger"] --> I["Inputs resolved"]
  I --> E["execute(context)"]
  E --> O["Outputs applied"]
```

A process is defined by:

- **Triggers** — what causes it to run.
- **Inputs** — data resolved *before* your code runs and handed to it.
- **Code** — your `execute` body, in Python or TypeScript.
- **Outputs** — what is done with the result *after* your code runs.

### Triggers

| Trigger | Runs when… |
| --- | --- |
| `cron` | a cron schedule fires |
| `interval` | a fixed interval elapses |
| `tag_change` | a subscribed tag changes |
| `http` | an HTTP request hits the process endpoint |
| `manual` | you run it explicitly (console / SDK) |

### Inputs and outputs

- **Inputs**: `tag` (a tag's value) or `sql` (the result of a query). Resolved and
  passed in as `context.inputs`.
- **Outputs**: `sql` (write to the database) or `tag_write` (publish to a tag).
  Output templating uses `{{output.field}}` for SQL and dot-notation for tag writes.

:::note[Tag-change values aren't auto-injected]
If a process is triggered by `tag_change`, add a **tag input** to receive the new
value inside `context.inputs`.
:::

## Writing a process

### TypeScript

The SDK is injected as a global `sdk` — no import, no initialization:

```ts
async function execute(context: ProcessContext): Promise<any> {
  const { inputs, trigger } = context;

  const readings = await sdk.collection('myapp.readings').getAll();
  const avg = readings.reduce((s, r) => s + r.value, 0) / readings.length;

  return { avg };
}
```

### Python

Python processes receive a `context` dict. (The injected SDK is available in
TypeScript processes; in Python, use **SQL inputs/outputs** to read and write data.)

```python
def execute(context):
    inputs = context['inputs']
    # ...your logic...
    return { 'ok': True }
```

## Deploying a process

You author and deploy processes with the [MACHHUB Designer](/designer/overview/) VS
Code extension, which sends your code to the platform. Under the hood this uses the
designer process endpoints — `POST /machhub/designer/processes` to create and
`PUT /machhub/designer/processes` to update. Each domain gets its own isolated worker
with its own dependencies (`pip` / `npm`), and the process **version**
auto-increments on each deploy.

## Invoking a process

From an app, call it through the SDK:

```ts
const result = await sdk.processes.execute('computeAverage', { window: '1h' });
```

A process with an **HTTP trigger** also exposes an endpoint at `POST /process/<slug>`,
where the JSON body is merged into `context.inputs`. See
[SDK → Processes](/sdk/processes/) and the [API Reference](/api/data-plane/) for the
exact calls.

## Logs and packages

- **Logs** stream while a process runs (handy during development).
- **Packages** are managed per domain — add the `pip`/`npm` dependencies your code
  needs.

## Related

- Concept: [Processes & Flows](/concepts/processes-and-flows/)
- SDK: [Processes](/sdk/processes/) and [Advanced (remote functions, workflows)](/sdk/advanced/)
