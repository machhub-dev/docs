---
title: Glossary
description: Definitions of the core MACHHUB terms — from Collections and the Unified Namespace to Processes, Flows, the Historian, and the SDK.
sidebar:
  order: 3
---

Concise definitions of the terms used throughout these docs.

- **MACHHUB Platform** — the self-contained MACHHUB service: the REST API, the MQTT
  broker, the data store and Historian, and the web console, in one install. See [Architecture](/concepts/architecture/).
- **Domain** — a tenant/workspace. Data, users, groups, and namespaces belong to a
  domain. The built-in admin domain is `domains:machhub_admin`. See [Domains](/concepts/domains/).
- **Application** — a user-developed app you build and deploy on MACHHUB, with its own
  runtime (start/stop, served on a port). Today each Application is backed by an
  application-type domain; the two are distinct and being separated. See
  [Applications](/concepts/domains/#applications).
- **Collection** — a typed data table (schema + records). See [Collections](/concepts/collections/).
- **Field** — a typed column of a collection (`string`, `number`, `relation`, `file`, …).
- **RecordID** — a record's identifier, `application_id.collection:record_id`. See [RecordID](/sdk/record-id/).
- **Unified Namespace (UNS)** — the hierarchical tree (namespaces → folders → tags)
  that models your plant's data. See [Unified Namespace](/concepts/unified-namespace/).
- **Namespace** — a top-level node in the UNS (the root of a domain's tag tree).
- **Folder** — a non-leaf node in the UNS used for organization.
- **Tag** — a leaf in the UNS representing one live signal; maps to an MQTT topic.
- **Topic** — the MQTT address of a tag, e.g. `line1/oven/temperature`.
- **Historian** — time-series storage for tag values. See [Historian](/concepts/historian/).
- **Historize** — to enable history on a tag (on-change or sampled) with a retention
  policy. See [Historize a tag](/console/historize/).
- **Process** — a **serverless function** (Python or TypeScript) run by the platform.
  See [Processes & Flows](/concepts/processes-and-flows/).
- **Flow** — a **Node-RED** pipeline for ingesting device data (PLCs, sensors,
  unsupported protocols) into MACHHUB via the `@machhub-dev/node-red-nodes` library.
- **Upstream** — an MQTT bridge that mirrors part of the UNS to/from another **MACHHUB
  instance**. See [Upstreams](/concepts/upstreams/).
- **Namespace binding** — an upstream mapping that ties a branch of your UNS to a branch
  on the remote MACHHUB, mirroring the whole subtree of tags across the bridge.
- **Namespace sharing** — granting another domain access to part of your domain's UNS,
  so its tags can be read from that other domain.
- **SDK** — the official TypeScript client, `@machhub-dev/sdk-ts`. See [SDK](/sdk/initialization/).
- **Designer** — the MACHHUB Designer VS Code extension: connect to a MACHHUB Platform,
  manage source/builds, deploy your project, and proxy your dev server's SDK requests
  to the connected platform. See [Designer](/designer/overview/).
- **MACHHUB Environment** — the MACHHUB Platform server the Designer is currently
  connected to; the Designer proxies your dev server's SDK requests to it.
- **API key** — a machine credential of the form `mchx_…`, sent as `X-Machhub-Api-Key`.
- **JWT** — the signed token returned by login, sent as `Authorization: Bearer`.
- **Feature / Action / Scope** — the three parts of a permission: the resource, the
  operation (`read` / `read-write`), and the record range (`self` / `domain` / `all`).
- **MQTT** — the pub/sub protocol used for realtime tags.
