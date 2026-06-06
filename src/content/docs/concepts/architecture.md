---
title: Architecture
description: How MACHHUB Platform is put together — the REST API, the embedded MQTT broker and NATS runtime, the SurrealDB store and Historian, the web console, the SDK, and the request lifecycle.
sidebar:
  order: 1
---

MACHHUB ships as **MACHHUB Platform**: a single Go binary that runs the entire stack.
Rather than wiring together a database, a message broker, a function runtime, and an
API gateway yourself, the Platform bundles them and exposes one coherent surface.

## Components inside MACHHUB Platform

```mermaid
flowchart LR
  subgraph Binary["machhub (single Go binary)"]
    direction TB
    REST["REST API\n(GoFiber / fasthttp)"]
    BROKER["Embedded MQTT broker\nTCP + WebSocket"]
    NATS["Embedded NATS\n(runtime RPC bus)"]
    CRON["Cron jobs\n(retention, log rotation)"]
    STATIC["Static file server\n(serves the Web Console)"]
  end

  STORE[("SurrealDB v2\nstore + Historian")]
  RUNTIMES["Language runtimes\n(Python / TypeScript)"]

  REST <--> STORE
  BROKER --> STORE
  BROKER <--> NATS
  NATS <--> RUNTIMES
  CRON --> STORE
```

| Component | Technology | Responsibility |
| --- | --- | --- |
| **REST API** | GoFiber (on fasthttp) | All HTTP endpoints: auth, the SDK data plane, and the management API. |
| **MQTT broker** | embedded [mochi-mqtt] | The realtime substrate for the Unified Namespace. Exposes TCP (default `:1883`) and MQTT-over-WebSocket for browsers. |
| **NATS** | embedded NATS + JetStream | The RPC bus that dispatches Process/function execution to language runtimes. |
| **Store + Historian** | SurrealDB v2 | The schemaless database for all entities, collection tables, and time-series history. |
| **Static server** | GoFiber | Serves the compiled web console as a single-page app. |
| **Cron** | robfig/cron | Background jobs such as Historian retention and log rotation. |

[mochi-mqtt]: https://github.com/mochi-mqtt/server

:::note[Edge-first]
The Platform is designed to run *next to your equipment*. Production builds target Linux
(including ARM64 / Raspberry Pi) and install as `systemd` services. See
[Install & Self-Hosting](/install/overview/).
:::

## The three API surfaces

The REST API is organized into three groups. Knowing which is which makes the rest
of the docs click into place:

```mermaid
flowchart TB
  client["Client (browser, SDK, device, integration)"]
  subgraph api["REST API"]
    auth["/auth/*  — login"]
    machhub["/machhub/*  — SDK data plane\ncollections CRUD, tags, historian,\nprocesses, functions, flows"]
    mgmt["/api/*  — management plane\ndomains, users, groups, api-keys,\nUNS, collections schema, settings, license"]
  end
  client --> auth
  client --> machhub
  client --> mgmt
```

- **`/auth/*`** — authentication (e.g. `POST /auth/login`).
- **`/machhub/*`** — the **SDK / data plane**: generic record CRUD, tags, historian,
  processes, functions, and flow execution. This is what the SDK mostly talks to.
- **`/api/*`** — the **management plane**: domains, users, groups, API keys, the UNS,
  collection schemas, settings, and licensing. This is what the **web console** uses.

See the [REST API Reference](/api/overview/) for the full endpoint catalog.

## Request lifecycle

Every request flows through a small middleware chain before reaching a handler:

```mermaid
sequenceDiagram
  participant C as Client
  participant Corr as WithCorrelation
  participant Dom as WithDomain
  participant Auth as VerifyAuth
  participant Perm as PermissionCheck
  participant H as Handler
  C->>Corr: HTTP request
  Corr->>Corr: assign correlation id (App-CorrelationID)
  Corr->>Dom: read "Domain" header (default domains:machhub_admin)
  Dom->>Auth: validate JWT (Bearer) or API key (X-Machhub-Api-Key)
  Auth->>Perm: Casbin permission check (feature/action/scope)
  Perm->>H: run handler -> store / broker / runtime
  H-->>C: JSON response + App-CorrelationID
```

- **Correlation** — each response carries an `App-CorrelationID` header for tracing.
- **Domain** — the `Domain` header selects the active tenant. See
  [Domains & Multi-tenancy](/concepts/domains/).
- **Authentication** — a JWT (`Authorization: Bearer …`) or an API key
  (`X-Machhub-Api-Key: mchx_…`). See [Authentication](/concepts/authentication/).
- **Authorization** — a Casbin RBAC check by *feature*, *action*, and *scope*. See
  [Authorization & Permissions](/concepts/authorization/).

## How clients connect

```mermaid
flowchart LR
  subgraph Clients
    UI["Web Console (SvelteKit SPA)"]
    SDKApp["Your app (@machhub-dev/sdk-ts)"]
    Dev["VS Code (MACHHUB Designer)"]
    Dev2["Node-RED (Flows)"]
  end
  EDGE["MACHHUB Platform"]
  UI -- "REST + MQTT/WS" --> EDGE
  SDKApp -- "REST + MQTT" --> EDGE
  Dev -- "deploy processes / config" --> EDGE
  Dev2 -- "read/write tags via MQTT" --> EDGE
```

- The **web console** is a SvelteKit single-page app that calls the REST API and
  subscribes to tags over MQTT-WebSocket. (It uses its own thin API client — the SDK
  is for the apps *you* build.)
- **Your apps** use the SDK, which wraps the same REST + MQTT surfaces.
- **MACHHUB Designer** configures the SDK and helps deploy Processes.
- **Node-RED** reads and writes tags through custom MACHHUB nodes.

## Data, in one picture

```mermaid
flowchart TB
  Domain["Domain (tenant)"]
  Domain --> Collections["Collections (typed tables + records)"]
  Domain --> UNS["Unified Namespace"]
  UNS --> Folders["Folders"]
  Folders --> Tags["Tags (MQTT topics)"]
  Tags -- "historize" --> Historian[("Historian (time-series)")]
  Tags -- "trigger" --> Processes["Processes (serverless functions)"]
  Tags -- "read/write" --> Flows["Flows (Node-RED)"]
  Tags -- "bridge" --> Upstreams["Upstreams (other brokers)"]
```

Continue with [Domains & Multi-tenancy](/concepts/domains/), or jump straight to
[Collections](/concepts/collections/).
