---
title: Python processes
description: Writing a Python process body with def execute(context), why the SDK is unavailable in Python, and a worked example.
sidebar:
  order: 3
---

A Python [process](/processes/model/) is wrapped by MACHHUB in an `execute` function —
you write only the body. The `inputs` and `trigger` locals are made available for
convenience.

```python
def execute(context):
    inputs = context['inputs']
    trigger = context['trigger']
    # YOUR CODE HERE
```

## The context

`context` is a dict:

```python
context = {
    'inputs':       { ... },          # resolved inputs (tag reads, SQL results, HTTP body fields)
    'trigger': {
        'type':   'cron',             # 'cron' | 'interval' | 'tag_change' | 'http' | 'manual'
        'config': { ... },            # cron_expression / interval_* / tag / endpoint
        'data':   { ... },            # runtime-only: tag_change or http request details
    },
    'timestamp':    '2026-06-03T...',  # ISO 8601
    'domain_id':    'domains:xxx',
    'process_name': 'myProcess',
}
```

Access an input by the name you configured it with:

```python
sensor_value = inputs['temperature']   # from a tag input named "temperature"
latest = inputs.get('latestReading')   # from an sql input named "latestReading"
```

## The SDK is not available in Python

:::caution[No `sdk` in Python processes]
The MACHHUB SDK is injected only into **TypeScript** processes. It is **not** available
in Python. For data access in a Python process, use configured **SQL inputs** (to
read) and **SQL outputs** (to write), or a **tag input** / **tag_write output** for
[UNS](/concepts/unified-namespace/) values.
:::

If you need to read records, add a SQL input with a query; if you need to write
results, add a SQL output with `{{output.field}}` placeholders or a tag_write output.
See [The Process model](/processes/model/#inputs).

## Worked example

A scheduled aggregation: a **cron** trigger runs the process hourly, a **SQL input**
named `hourlyReadings` fetches the latest rows, the code computes summary statistics,
and a **SQL output** persists them.

```python
from datetime import datetime


def execute(context):
    # inputs is a local var (same as context['inputs'])
    readings = inputs.get('hourlyReadings', [])

    if not readings:
        return {'count': 0, 'average': None}

    values = [r['value'] for r in readings]
    average = sum(values) / len(values)

    print(f"Aggregated {len(readings)} readings. avg={average:.2f}")

    return {
        'count': len(readings),
        'average': round(average, 4),
        'min': min(values),
        'max': max(values),
        'timestamp': datetime.utcnow().isoformat()
    }
```

Configure it as:

- **Trigger** — `cron`, expression `0 * * * *` (every hour).
- **Input** — `sql`, name `hourlyReadings`,
  query `SELECT * FROM myapp.readings WHERE created_dt > time::now() - 1h;`
- **Output** — `sql`,
  query `INSERT INTO myapp.hourly_summary { count: {{output.count}}, average: {{output.average}} };`

The returned `count` and `average` fill the `{{output.*}}` placeholders. Standard
library modules are always available; add third-party packages via per-domain
[package management](/processes/invoking/#package-management).

## Example: tag-change alert

When a process fires on `tag_change`, remember to add a **tag input** so the value
lands in `inputs` (the trigger does not inject it):

```python
def execute(context):
    THRESHOLD = 80
    new_value = inputs['temperature']   # from a tag input named "temperature"

    status = 'alert' if new_value > THRESHOLD else 'normal'
    print(f"Temperature: {new_value} status: {status}")

    return {'status': status, 'value': new_value}
```

Pair it with a **tag_change** trigger on the sensor tag, a **tag input** for the same
path, and a **tag_write output** with `field: "status"` to publish the result.

## Related

- [The Process model](/processes/model/),
  [TypeScript processes](/processes/typescript/),
  [Invoking a process](/processes/invoking/)
