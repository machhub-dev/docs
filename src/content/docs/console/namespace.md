---
title: Manage the Unified Namespace
description: Build and edit your UNS in the console — namespaces, folders, tags, live values, historization, and importing/exporting the folder/tag tree structure.
sidebar:
  order: 5
---

The **Namespace → Manage** page is the visual editor for your
[Unified Namespace](/concepts/unified-namespace/). It is a three-pane workspace:
namespaces on the left, the folder/tag tree in the middle, and tag details on the
right.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>UNS editor at /namespace/manage</strong> — three panes, a tag selected showing its live value (prefer dark mode).</div>
</figure>

## Pane 1 — Namespaces

Each domain owns **exactly one** namespace. The left pane lists the namespaces you can work with:

- your domain's **own** namespace (selected at the top);
- **Shared** — namespaces another domain has shared with you (see
  [namespace sharing](/concepts/unified-namespace/#sharing-a-namespace-across-domains));
- **Downstream** — namespaces coming from downstream MACHHUB instances (also called
  **upstream clients**) connected via [Upstreams](/concepts/upstreams/).

## Pane 2 — The tree

The middle pane is the recursive **folder / tag tree**:

- **Folders** organize the tree and can be expanded/collapsed.
- **Tags** are leaves (shown with a bookmark icon) — each maps to an MQTT topic.
- An icon marks tags that are **historized**.

Use **Add Folder** and **Add Tag** to grow the tree (names again cannot contain
`#`/`+`).

<figure>
  <div class="mh-shot">🎞️ GIF to capture: add a folder, then add a tag under it.</div>
</figure>

### Folder actions (right-click)

**Right-click a folder** to open its context menu, with two actions:

#### Auto Discovery

**Auto Discovery** automatically discovers and creates tags under the folder based on
the data received on it — so you don't have to define every tag by hand.

1. Right-click the folder → **Auto Discovery**. A settings dialog opens.
2. Toggle **Auto Discovery** on.
3. Optionally set a **Timer** — how long Auto Discovery stays active (`None`,
   `1 minute`, `5 minutes`, `10 minutes`, `30 minutes`, `45 minutes`, or `1 hour`).
   With a timer, Auto Discovery turns **off automatically** when the timer elapses;
   `None` leaves it on until you turn it off.
4. **Save**.

Once enabled, a pulsing <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-0.15em" aria-hidden="true"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg> icon appears next to the folder to show Auto Discovery is active.

#### Bind to Namespace

**Bind to Namespace** binds this folder to a target namespace on a connected
[Upstream](/concepts/upstreams/), so the folder's tags mirror to the upstream MACHHUB.
See [Upstreams → namespace bindings](/concepts/upstreams/#namespace-bindings).

## Pane 3 — Details

Selecting a **folder or tag** opens its detail panel:

- **Topic breadcrumb** — the full path, collapsing to a dropdown when deep.
- **Live value** *(tags)* — the console subscribes to the tag over MQTT and shows its
  current value. You can edit the value and **Send** (publish) it.
- **Import / Export** — export the folder/tag **tree structure** (the shape, without
  tag data) so it can be imported under another namespace or folder.
- **Historize** — toggle [history recording](/console/historize/) for the tag.
- **Description** — free-text notes (Markdown).

<figure>
  <div class="mh-shot">🎞️ GIF to capture: select a tag, edit its value, press Send, see the success toast.</div>
</figure>

## Common tasks

- **Enable history** on a tag → [Historize a tag](/console/historize/).
- **Mirror tags** to another MACHHUB instance → bind the namespace in
  [Upstreams](/console/upstreams/).
- **View history** → [Historian](/console/historian/).

## Related

- Concept: [Unified Namespace](/concepts/unified-namespace/) and [Realtime](/concepts/realtime/)
- Code: [SDK → Realtime](/sdk/realtime/)
