---
title: Historian (Time-Series)
description: Query time-series tag data with SurrealQL aggregations and export historized data as a gzipped CSV Blob using the MACHHUB SDK historian namespace.
sidebar:
  order: 7
---

The Historian stores **all** time-series tag readings for historical analysis and
trending. Use it instead of Collections for time-series data. The `sdk.historian`
namespace offers a raw SurrealQL query method and a CSV export that returns a gzipped
`Blob`.

:::tip[When to use the Historian]
Time-series readings, historical queries and trends, and aggregation (average, min, max,
sum) belong in the Historian. Keep alerts, anomalies, and configuration in
[Collections](/sdk/collections/).
:::

## Querying with SurrealQL

`query` takes a raw SurrealQL string and runs it against the `historian` table, which
stores per-topic readings with `topic`, `value`, and `time` fields.

```typescript
query(SurrealQL: string): Promise<any>
```

```typescript
import { getOrInitializeSDK } from './sdk.service';

const sdk = await getOrInitializeSDK();

const history = await sdk.historian.query(
  `SELECT time::floor(time, 1h) AS hour, math::mean(value) AS avg_value
   FROM historian WHERE topic = 'temperature/room1'
   AND time >= '2024-01-01T00:00:00Z' AND time <= '2024-01-02T00:00:00Z'
   GROUP BY hour ORDER BY hour ASC`
);

console.log(history);
// [
//   { hour: '2024-01-01T00:00:00Z', avg_value: 22.5 },
//   { hour: '2024-01-01T01:00:00Z', avg_value: 23.1 },
//   ...
// ]
```

### Aggregation functions

Bucket time with `time::floor(time, <interval>)` (for example `1h`, `30m`) and aggregate
with the functions below.

| Function       | Description        | Use case               |
| -------------- | ------------------ | ---------------------- |
| `math::mean()` | Average value      | Temperature trends     |
| `math::min()`  | Minimum value      | Lowest readings        |
| `math::max()`  | Maximum value      | Peak detection         |
| `math::sum()`  | Sum of values      | Total production count |
| `count()`      | Number of readings | Data availability      |

### Examples

```typescript
// Last 24 hours, hourly average
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const data = await sdk.historian.query(
  `SELECT time::floor(time, 1h) AS hour, math::mean(value) AS avg_value
   FROM historian WHERE topic = 'temperature/room1'
   AND time >= '${yesterday.toISOString()}' AND time <= '${now.toISOString()}'
   GROUP BY hour ORDER BY hour ASC`
);

// Multiple sensors, 30-minute buckets
const multi = await sdk.historian.query(
  `SELECT topic, time::floor(time, 30m) AS period, math::mean(value) AS avg_value
   FROM historian WHERE topic IN ['temperature/room1', 'temperature/room2', 'temperature/room3']
   AND time >= '2024-01-01T00:00:00Z' AND time <= '2024-01-02T00:00:00Z'
   GROUP BY topic, period ORDER BY period ASC`
);

// Hourly production totals
const production = await sdk.historian.query(
  `SELECT time::floor(time, 1h) AS hour, math::sum(value) AS total_count
   FROM historian WHERE topic = 'production/line1/count'
   AND time >= '2024-01-01T08:00:00Z' AND time <= '2024-01-01T17:00:00Z'
   GROUP BY hour ORDER BY hour ASC`
);
```

## Exporting data as CSV

`getHistoricalDataAsCSV` exports one or more topics as a **gzipped CSV `Blob`**. With
multiple topics the result is merged into a single CSV with columns
`[Timestamp, topic1, topic2, ...]`. Optional time bucketing (`sampleRate`) and
aggregation reduce the row count.

```typescript
getHistoricalDataAsCSV(
  topics: string[],
  startDate: Date,
  endDate: Date,
  timezone?: string,
  sampleRate?: string,
  aggregation?: 'mean' | 'sum' | 'min' | 'max' | 'median' | 'none',
  mapping?: Record<string, string>,
): Promise<Blob>
```

| Parameter     | Type                                             | Required | Description |
| ------------- | ------------------------------------------------ | -------- | ----------- |
| `topics`      | `string[]`                                       | Yes      | Topic strings to export |
| `startDate`   | `Date`                                           | Yes      | Start of the data range |
| `endDate`     | `Date`                                           | Yes      | End of the data range |
| `timezone`    | `string`                                         | No       | IANA timezone, e.g. `"Asia/Kuala_Lumpur"` |
| `sampleRate`  | `string`                                         | No       | Bucket interval in underscore format, e.g. `"5_second"`, `"1_minute"`, `"1_hour"` |
| `aggregation` | `'mean'\|'sum'\|'min'\|'max'\|'median'\|'none'` | No       | Aggregation applied within each bucket |
| `mapping`     | `Record<string, string>`                         | No       | Rename topic columns in the CSV header |

### `sampleRate` format

The bucket interval uses an underscore format: `<count>_<unit>`.

| Value         | Meaning           |
| ------------- | ----------------- |
| `"5_second"`  | 5-second buckets  |
| `"1_minute"`  | 1-minute buckets  |
| `"15_minute"` | 15-minute buckets |
| `"1_hour"`    | 1-hour buckets    |
| `"1_day"`     | Daily buckets     |

### Examples

```typescript
// Single topic, full resolution
const blob = await sdk.historian.getHistoricalDataAsCSV(
  ['Sensor/Temperature'],
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

// Multiple topics, timezone + renamed columns
const renamed = await sdk.historian.getHistoricalDataAsCSV(
  ['Sensor/Temperature', 'Sensor/Humidity', 'Sensor/Pressure'],
  new Date('2024-01-01'),
  new Date('2024-01-31'),
  'Asia/Kuala_Lumpur',
  undefined,
  undefined,
  {
    'Sensor/Temperature': 'Temp °C',
    'Sensor/Humidity': 'Humidity %',
    'Sensor/Pressure': 'Pressure hPa',
  }
);

// Hourly average
const hourly = await sdk.historian.getHistoricalDataAsCSV(
  ['production/line1', 'production/line2'],
  new Date('2024-01-01'),
  new Date('2024-01-07'),
  'UTC',
  '1_hour',
  'mean'
);
```

### Trigger a browser download

The export is a `Blob`, so download it with an object URL — and revoke the URL when
done.

```typescript
const blob = await sdk.historian.getHistoricalDataAsCSV(
  ['Sensor/Temperature'],
  startDate,
  endDate,
  'Asia/Kuala_Lumpur',
  '1_minute',
  'mean'
);

const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'sensor_data.csv.gz';
a.click();
URL.revokeObjectURL(url);
```

## Checklist

- [ ] Time-series data stored in the Historian (not Collections).
- [ ] Time ranges bounded to what you need.
- [ ] Aggregation/`sampleRate` used to reduce volume for large ranges.
- [ ] Object URLs revoked after CSV downloads.

## Next

- Subscribe to live values in [Real-Time Tags](/sdk/realtime/).
- See more analytics helpers in [Advanced](/sdk/advanced/).
