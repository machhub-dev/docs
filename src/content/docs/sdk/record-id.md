---
title: RecordID
description: How MACHHUB identifies records — the application_id.collection:record_id format, the structured {Table, ID} form, and the helpers to convert and extract IDs.
sidebar:
  order: 11
---

Every record in a [Collection](/concepts/collections/) is identified by a **RecordID**.
Understanding its format is the key to relations, updates, and deletes.

## The string format

```
application_id.collection_name:record_id
```

For example: `myapp.products:PROD-001`.

- `myapp` — your `application_id`
- `products` — the collection name
- `PROD-001` — the record's own id

## The structured form

The SDK also accepts and returns the structured object form:

```ts
{ Table: "myapp.products", ID: "PROD-001" }
```

## Converting between them

```ts
import { RecordIDToString, StringToRecordID, type RecordID } from '@machhub-dev/sdk-ts';

RecordIDToString({ Table: 'myapp.categories', ID: 'CAT-001' });
// → "myapp.categories:CAT-001"

StringToRecordID('myapp.categories:CAT-001');
// → { Table: "myapp.categories", ID: "CAT-001" }
```

## Extracting the short id

A common need is the bare id (without the table prefix), e.g. for display or routing.
This helper handles strings and reference objects alike:

```ts
function extractId(value: any): string {
  if (typeof value === 'object' && value?.ID) value = value.ID;
  if (typeof value === 'string' && value.includes(':')) return value.split(':')[1];
  return value;
}
```

## Rules to remember

:::caution[Use the full id for writes]
- **`update()` and `delete()` require the FULL id** (`myapp.products:PROD-001`), not
  just `PROD-001`.
- **Relations are written as a reference object** `{ Table, ID }`, not as a raw string.
  See [Collections → relations](/sdk/collections/).
- `update()` is a **PATCH** — only the fields you pass are changed.
:::

## Example

```ts
// Relation written as a reference object:
await sdk.collection('products').create({
  name: 'Wireless Mouse',
  categoryId: { Table: 'myapp.categories', ID: 'CAT-002' },
});

// Update/delete use the full RecordID string:
await sdk.collection('products').update('myapp.products:PROD-001', { price: 34.99 });
await sdk.collection('products').delete('myapp.products:PROD-001');
```
