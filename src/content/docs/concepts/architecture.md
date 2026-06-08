---
title: Architecture
description: How MACHHUB fits together — the console, the realtime broker, the data store and Historian, the Processes runtime, bundled Node-RED, and the SDK — plus the API surfaces and how clients connect.
sidebar:
  order: 1
---

MACHHUB runs as a single self-contained service. Rather than assembling a database, a
message broker, an automation engine, and an API yourself, MACHHUB bundles them and
exposes one coherent surface — so you can run a complete data fabric on anything from
a server to a small edge device.

## What's inside

```mermaid
flowchart TB
  subgraph Service["MACHHUB Platform — one self-contained service"]
    direction TB
    CONSOLE["Web console"]
    REST["REST API\n(/auth/*, /machhub/*)"]
    BROKER["MQTT broker — UNS / Tags\n(TCP + WebSocket)"]
    PROC["Processes runtime\n(Python / TypeScript)"]
    FLOWS["Node-RED\n(Flows — device ingestion)"]
    STORE[("Data store + Historian")]

    CONSOLE --> REST
    PROC --> REST
    FLOWS --> REST
    FLOWS --> BROKER
    REST <--> STORE
    BROKER --> STORE
  end
```

| Part                       | What it does                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Web console**            | The browser app you use to operate MACHHUB.                                                                                     |
| **REST API**               | Authentication and the SDK data plane.                                                                                          |
| **MQTT broker**            | The realtime substrate for the Unified Namespace. Speaks MQTT over TCP (default `1883`) and over WebSocket for browsers.        |
| **Processes runtime**      | Run your [Processes](/processes/overview/) (Python or TypeScript).                                                              |
| **Node-RED (Flows)**       | Bundled [Flows](/concepts/processes-and-flows/) engine for ingesting device data via the `@machhub-dev/node-red-nodes` library. |
| **Data store & Historian** | Persists everything — collections and records, the Unified Namespace, users and groups, and time-series history.                |

## The two API surfaces

The REST API is organized into two groups. Knowing which is which makes the rest
of the docs click into place:

```mermaid
flowchart TB
  client["Client (browser, SDK, device, integration)"]
  subgraph api["REST API"]
    auth["/auth/*  — login"]
    machhub["/machhub/*  — SDK data plane\ncollections CRUD, tags, historian,\nprocesses, functions, flows"]
  end
  client --> auth
  client --> machhub
```

- **`/auth/*`** — authentication (e.g. `POST /auth/login`).
- **`/machhub/*`** — the **SDK / data plane**: generic record CRUD, tags, historian,
  processes, functions, and flow execution. This is what the SDK mostly talks to.

See the [REST API Reference](/api/overview/) for the full endpoint catalog.

## How clients connect

```mermaid
flowchart LR
  subgraph Clients
    UI["Web Console (browser)"]
    SDKApp["Your app (@machhub-dev/sdk-ts)"]
    Dev["Your Local Dev Server"]
    Dev2["Node-RED (Flows)\ndevice ingestion"]
  end
  EDGE["MACHHUB"]
  UI -- "REST + MQTT/WS" --> EDGE
  SDKApp -- "MACHHUB SDK" --> EDGE
  Dev -- "VS Code (MACHHUB Designer)" --> EDGE
  Dev2 -- "@machhub-dev/node-red-nodes" --> EDGE
```

- The **web console** calls the REST API and subscribes to tags over
  MQTT-over-WebSocket. (It uses its own thin client — the SDK is for the apps *you*
  build.)
- **Your app** talks to MACHHUB through the **`@machhub-dev/sdk-ts`** SDK, which wraps
  the same REST + MQTT surfaces.
- **Your local dev server** reaches MACHHUB through the **MACHHUB Designer** (VS Code):
  the extension connects to the platform, proxies the dev server's SDK requests to it,
  and deploys your project from the editor.
- **Node-RED Flows** ingest data from physical devices (PLCs, sensors, unsupported
  protocols) and write it into MACHHUB tags and Collections using the
  `@machhub-dev/node-red-nodes` library.

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
  Devices["PLCs / sensors / devices"] -- "ingest via" --> Flows["Flows (Node-RED)"]
  Flows -- "write tags" --> Tags
  Flows -- "write records" --> Collections
  Tags -- "bridge" --> Upstreams["Upstreams (other MACHHUB instances)"]
```

Continue with [Domains & Multi-tenancy](/concepts/domains/), or jump straight to
[Collections](/concepts/collections/).
