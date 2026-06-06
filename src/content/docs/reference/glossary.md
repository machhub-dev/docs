---
title: Glossary
description: Definitions of the core MACHHUB terms — from Collections and the Unified Namespace to Processes, Flows, the Historian, and the SDK.
sidebar:
  order: 3
---

Concise definitions of the terms used throughout these docs.

- **MACHHUB Platform** — the single Go binary that runs the whole platform (REST
  API, MQTT broker, NATS runtime, datastore, and web console). See [Architecture](/concepts/architecture/).
- **Domain** — a tenant/workspace. Data, users, groups, and namespaces belong to a
  domain. The built-in admin domain is `domains:machhub_admin`. See [Domains](/concepts/domains/).
- **Collection** — a typed data table (schema + records). See [Collections](/concepts/collections/).
- **Field** — a typed column of a collection (`string`, `number`, `relation`, `file`, …).
- **RecordID** — a record's identifier, `application_id.collection:record_id`. See [RecordID](/sdk/record-id/).
- **Unified Namespace (UNS)** — the hierarchical tree (namespaces → folders → tags)
  that models your plant's data. See [Unified Namespace](/concepts/unified-namespace/).
- **Namespace** — a top-level node in the UNS, of a type such as application, system,
  Node-RED, or custom.
- **Folder** — a non-leaf node in the UNS used for organization.
- **Tag** — a leaf in the UNS representing one live signal; maps to an MQTT topic.
- **Topic** — the MQTT address of a tag, e.g. `line1/oven/temperature`.
- **Historian** — time-series storage for tag values. See [Historian](/concepts/historian/).
- **Historize** — to enable history on a tag (on-change or sampled) with a retention
  policy. See [Historize a tag](/console/historize/).
- **Process** — a **serverless function** (Python or TypeScript) run by the platform.
  See [Processes & Flows](/concepts/processes-and-flows/).
- **Flow** — a **Node-RED** visual pipeline that reads/writes tags via MACHHUB nodes.
- **Upstream** — an MQTT bridge that forwards part of the UNS to/from another broker.
  See [Upstreams](/concepts/upstreams/).
- **Forwarding rule** — a mapping that re-publishes an internal topic to an upstream topic.
- **SDK** — the official TypeScript client, `@machhub-dev/sdk-ts`. See [SDK](/sdk/initialization/).
- **Designer** — the MACHHUB Designer VS Code extension (zero-config SDK + process
  authoring). See [Designer](/designer/overview/).
- **API key** — a machine credential of the form `mchx_…`, sent as `X-Machhub-Api-Key`.
- **JWT** — the EdDSA-signed token returned by login, sent as `Authorization: Bearer`.
- **Casbin** — the library behind MACHHUB's RBAC. See [Authorization](/concepts/authorization/).
- **Feature / Action / Scope** — the three parts of a permission: the resource, the
  operation (`read` / `read-write`), and the record range (`self` / `domain` / `all`).
- **MQTT** — the pub/sub protocol used for realtime tags.
- **NATS** — the internal messaging bus used to dispatch Process execution to language
  runtimes.
