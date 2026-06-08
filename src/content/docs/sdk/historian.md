---
title: Historian (Time-Series)
description: Read and export historized tag data with the MACHHUB SDK historian namespace — bucketed aggregation (mean, sum, min, max, median) and a gzipped CSV Blob.
sidebar:
  order: 7
---

The Historian stores **all** time-series tag readings for historical analysis and
trending. Use it instead of Collections for time-series data. The `sdk.historian`
namespace exports historized readings — with optional bucketing and aggregation — as
a gzipped CSV `Blob`.

:::tip[When to use the Historian]
Time-series readings, historical queries and trends, and aggregation (average, min,
max, sum) belong in the Historian. Keep alerts, anomalies, and configuration in
[Collections](/sdk/collections/).
:::

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
import { getOrInitializeSDK } from './sdk.service';

const sdk = await getOrInitializeSDK();

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
- [ ] Aggregation / `sampleRate` used to reduce volume for large ranges.
- [ ] Object URLs revoked after CSV downloads.

## Next

- Subscribe to live values in [Real-Time Tags](/sdk/realtime/).
- See more analytics helpers in [Advanced](/sdk/advanced/).
