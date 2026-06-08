---
title: Historian
description: View historized tag data as charts and export it to CSV in the MACHHUB console.
sidebar:
  order: 7
---

The **Namespace → Historian** page visualizes the time-series you recorded by
[historizing tags](/console/historize/), and exports it to CSV.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Historian at /namespace/historian</strong> — a clean line chart with the tooltip visible.</div>
</figure>

## View a chart

1. Open the **Filters** panel.
2. Pick a **Historized Tag**.
3. Pick a **Value Key** (the field within the tag's payload to plot).
4. Choose a **Time Range** (1m, 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1d, 7d, 30d).

The chart renders the selected series and **auto-refreshes** every few seconds.
Non-numeric values fall back to a timestamp/value table.

<figure>
  <div class="mh-shot">🎞️ GIF to capture: open Filters → choose tag/key/range → chart renders and updates.</div>
</figure>

## Export to CSV

1. Open the **Export** dialog.
2. Select one or more tags.
3. Choose a date range (presets like Today / Last 7 days, or a custom range).
4. Export — the console downloads a CSV per tag, showing a per-tag progress bar.

<figure>
  <div class="mh-shot">🎞️ GIF to capture: Export dialog → select tags + date range → download with progress.</div>
</figure>

## Doing this in code

The same data is available through the SDK — export historized tags as a CSV `Blob`,
with optional bucketing and aggregation:

```ts
const blob = await sdk.historian.getHistoricalDataAsCSV(
  ['line1/oven/temperature'],
  startDate,
  endDate,
  'UTC',
  '1_hour',   // bucket interval
  'mean'      // aggregation
);
```

See [SDK → Historian](/sdk/historian/) and the [Historian concept](/concepts/historian/).
