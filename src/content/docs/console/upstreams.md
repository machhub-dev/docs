---
title: Upstreams (MQTT bridges)
description: Connect MACHHUB to another MQTT broker — create an upstream, bind namespaces, and toggle the bridge on or off.
sidebar:
  order: 8
---

**Upstreams** bridge your MACHHUB broker to another MQTT broker, forwarding parts of
your [Unified Namespace](/concepts/unified-namespace/) for edge-to-cloud or
site-to-site data flow. Manage them under **Namespace → Upstreams**.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Upstreams list at /namespace/upstreams</strong> — a bridge with its on/off toggle.</div>
</figure>

## Create an upstream

1. Click **Create Upstream**.
2. Set the **Broker Host**: protocol (`mqtt://`, `mqtts://`, `ws://`, `wss://`), host,
   **port** (default `1883`), and optional path.
3. Add one or more **namespace bindings**: pick an internal namespace (folder) and a
   target namespace on the remote broker.
4. Save.

🎞️ *GIF to capture: Create Upstream → choose mqtt:// + host/port → add a binding → Save → toggle it on.*

## Manage upstreams

The list shows each bridge's host, its namespace bindings, and a switch to
**connect/disconnect** it. You can delete a bridge from the same row.

```mermaid
flowchart LR
  subgraph Local["This MACHHUB"]
    UNS["UNS topics"]
  end
  UNS -->|forwarding rules| UP["Upstream bridge"]
  UP -->|mqtt(s)/ws(s)| Remote["Remote broker / cloud"]
```

## Forwarding rules

Which topics actually flow upstream is controlled by **forwarding rules** on tags and
folders — add these from the [tag details pane](/console/namespace/). See the
[Upstreams concept](/concepts/upstreams/) for the model.
