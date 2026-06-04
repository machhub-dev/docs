---
title: Manage the Unified Namespace
description: Build and edit your UNS in the console — namespaces, folders, tags, access levels, live values, forwarding rules, and related flows.
sidebar:
  order: 5
---

The **Namespace → Manage** page is the visual editor for your
[Unified Namespace](/concepts/unified-namespace/). It is a three-pane workspace:
namespaces on the left, the folder/tag tree in the middle, and tag details on the
right.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>UNS editor at /namespace/manage</strong> — three panes, a tag selected showing its live value and access badge (prefer dark mode).</div>
</figure>

## Pane 1 — Namespaces

Namespaces are grouped by type (**System**, **Node-RED**, **Application**, **Custom**).
Use **+** to add a namespace (give it a name and pick a category). Names may not
contain `#` or `+` (MQTT wildcard characters).

## Pane 2 — The tree

The middle pane is the recursive **folder / tag tree**:

- **Folders** organize the tree and can be expanded/collapsed.
- **Tags** are leaves (shown with a bookmark icon) — each maps to an MQTT topic.
- Node badges indicate access level, and icons mark tags that have **forwarding
  rules**, **related flows**, or are **historized**.

Use **Add Folder** and **Add Tag** to grow the tree (names again cannot contain
`#`/`+`).

🎞️ *GIF to capture: add a folder, then add a tag under it.*

## Pane 3 — Tag details

Selecting a tag opens its detail panel:

- **Access** — a color-coded badge and an access selector. Tags can be **R**
  (read-only) or **RW** (read-write); folders use **R** / **R+**.
- **Topic breadcrumb** — the full path, collapsing to a dropdown when deep.
- **Live value** — the console subscribes to the tag over MQTT and shows its current
  value. For **RW** tags you can edit the JSON value and **Send** (publish) it.
- **Description** — free-text notes (Markdown).
- **Forwarding rules** — re-publish this topic to an [upstream](/console/upstreams/).
- **Related flows** — the flows that trigger on, process, or output this tag.

🎞️ *GIF to capture: select an RW tag, edit its JSON value, press Send, see the success toast.*

## Common tasks

- **Enable history** on a tag → [Historize a tag](/console/historize/).
- **Forward** a tag to another broker → add a forwarding rule, then see
  [Upstreams](/console/upstreams/).
- **View history** → [Historian](/console/historian/).

## Related

- Concept: [Unified Namespace](/concepts/unified-namespace/) and [Realtime](/concepts/realtime/)
- Code: [SDK → Realtime](/sdk/realtime/)
