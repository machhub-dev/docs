---
title: Collections (CRUD & Queries)
description: Create, read, update, and delete records, build fluent queries with filters, sorting, and pagination, expand relations, and run batch operations with the MACHHUB SDK.
sidebar:
  order: 3
---

Collections are MACHHUB's typed data tables. The SDK exposes them through
`sdk.collection(name)`, which returns a fluent query builder for reading and a small set
of methods for writing. This page covers CRUD, the query API, JSON-array filtering,
field selection, relation expansion, pagination, and batch operations.

:::note
Every record identifier uses the format `application_id.collection:record_id` (for
example `myapp.products:PROD-001`). `update` and `delete` need the **full** id, and
relation fields are written as `{ Table, ID }` objects. The full rules live in
[Record IDs](/sdk/record-id/).
:::

## CRUD operations

### Create

```typescript
const sdk = await getOrInitializeSDK();

const newProduct = await sdk.collection('products').create({
  name: 'Wireless Mouse',
  sku: 'MOUSE-001',
  price: 29.99,
  quantity: 100,
  categoryId: {
    Table: "myapp.categories",
    ID: "CAT-002"
  }
});

console.log('Created:', newProduct);
```

### Read

```typescript
// Get all
const allProducts = await sdk.collection('products').getAll();

// Get one by full RecordID
const product = await sdk.collection('products')
  .getOne('myapp.products:PROD-001');

// Get first match of a query
const firstLowStock = await sdk.collection('products')
  .filter('quantity', '<', 10)
  .first();

// Count
const totalProducts = await sdk.collection('products').count();
```

### Update (PATCH — partial update)

`update()` is a **PATCH**: only the fields you provide change; everything else is left
untouched. It requires the **full** RecordID.

```typescript
// Update only price (other fields unchanged)
const updated = await sdk.collection('products').update(
  'myapp.products:PROD-001',
  {
    price: 34.99
  }
);

// Update a reference field
await sdk.collection('products').update(
  'myapp.products:PROD-001',
  {
    categoryId: {
      Table: "myapp.categories",
      ID: "CAT-003"
    }
  }
);
```

### Delete

```typescript
await sdk.collection('products').delete('myapp.products:PROD-001');
```

:::caution
Deletion behavior depends on the collection's `onDelete` configuration: `cascade`
deletes related records, `setNull` clears reference fields, and `restrict` blocks the
delete while references exist.
:::

## The fluent query API

Chain query methods on `sdk.collection(name)` and end the chain with a terminal method
(`getAll`, `first`, `count`, or `getOne`).

```typescript
const sdk = await getOrInitializeSDK();
const collection = sdk.collection('records');

// Single filter
const activeRecords = await collection
  .filter('state', '=', 'active')
  .getAll();

// Multiple (AND) filters
const filteredRecords = await collection
  .filter('state', '=', 'active')
  .filter('amount', '>', 100)
  .filter('score', '>=', 10)
  .getAll();

// OR filters
const openOrPending = await collection
  .orFilter('state', '=', 'open')
  .orFilter('state', '=', 'pending')
  .getAll();

// Sorting
const sortedRecords = await collection
  .sort('amount', 'desc')
  .getAll();

// Pagination
const paginatedRecords = await collection
  .offset(0)
  .limit(10)
  .getAll();

// Full chain
const results = await collection
  .filter('type', '=', 'standard')
  .orFilter('state', '=', 'active')
  .orFilter('state', '=', 'pending')
  .sort('amount', 'asc')
  .offset(20)
  .limit(10)
  .getAll();
```

### Query operators

| Operator   | Description           | Example                                          |
| ---------- | --------------------- | ------------------------------------------------ |
| `=`        | Equal to              | `.filter('state', '=', 'active')`                |
| `!=`       | Not equal to          | `.filter('state', '!=', 'archived')`             |
| `>`        | Greater than          | `.filter('amount', '>', 100)`                    |
| `<`        | Less than             | `.filter('score', '<', 10)`                      |
| `>=`       | Greater than or equal | `.filter('amount', '>=', 50)`                    |
| `<=`       | Less than or equal    | `.filter('score', '<=', 100)`                    |
| `CONTAINS` | String contains       | `.filter('title', 'CONTAINS', 'sample')`         |
| `IN`       | Value in array        | `.filter('state', 'IN', ['active', 'pending'])`  |

### Terminal methods

```typescript
// First matching record (or null)
const firstActive = await collection
  .filter('state', '=', 'active')
  .first();

// Count matching records
const activeCount = await collection
  .filter('state', '=', 'active')
  .count();

// Single record by full id
const record = await collection.getOne('myapp.records:REC-001');

// getOne with a RecordID object
import { RecordIDToString } from '@machhub-dev/sdk-ts';
const recordId = RecordIDToString({ Table: "myapp.records", ID: "REC-001" });
const sameRecord = await collection.getOne(recordId);
```

## Filtering inside JSON-array fields

Some collections store lines as a `json` field — an array of objects embedded in the
record (for example `purchaseOrders.orderLines`). Because these are `json` (not
`relation`) fields, plain `filter()` cannot reach inside them. Use `filterInArray()`,
which pushes the predicate into the database so only matching parent records are
returned.

```typescript
.filterInArray(arrayField: string, subField: string, operator: BasicOperator, value: any)
```

`BasicOperator` supports the same set as `filter`: `=` `!=` `<` `<=` `>` `>=`
`CONTAINS` `IN`.

```typescript
// ❌ BEFORE — load everything, filter in TypeScript (inefficient)
const allPOs = await sdk.collection('purchaseOrders').getAll();
const matchingPOs = allPOs.filter(po =>
  po.orderLines?.some((line: any) => line.itemId === 'myapp.items:ITEM-001')
);

// ✅ AFTER — filter pushed to the database, only matching records returned
const matchingPOs = await sdk.collection('purchaseOrders')
  .filterInArray('orderLines', 'itemId', '=', 'myapp.items:ITEM-001')
  .getAll();
```

You can combine `filterInArray()` with regular filters, and chain several sub-field
predicates:

```typescript
// Open sales orders that contain a specific item
const sos = await sdk.collection('salesOrders')
  .filterInArray('orderLines', 'itemId', '=', 'myapp.items:ITEM-001')
  .filter('status', '=', 'open')
  .getAll();

// Lines for an item priced under 50
const specificOrders = await sdk.collection('purchaseOrders')
  .filterInArray('orderLines', 'itemId', '=', 'myapp.items:ITEM-001')
  .filterInArray('orderLines', 'unitPrice', '<', 50)
  .getAll();
```

:::note
`filterInArray()` returns the correct **parent records** efficiently. To sum quantities
inside the matching lines you still iterate `orderLines` in TypeScript — but only over
records that actually contain the item, not the whole collection.
:::

## Selecting specific fields

Use `fields` to fetch only the columns you need and reduce payload size. It accepts an
array or a comma-separated string.

```typescript
// As an array
const products = await sdk.collection('products').getAll({
  fields: ['id', 'name', 'price']
});

// As a comma-separated string
const sameProducts = await sdk.collection('products').getAll({
  fields: 'id,name,price'
});
```

## Expanding related records

By default a reference field returns a RecordID. To fetch the full related record, use
`expand`. The SDK offers **two equivalent forms** — a chained `.expand(...)` method and
an `expand` option on `getAll`/`getOne`. Both accept a single field name or an array;
use whichever reads better.

```typescript
// Chained form
const productsWithCategory = await sdk
  .collection('products')
  .expand('categoryId')
  .getAll();

// Option form
const sameResult = await sdk.collection('products').getAll({
  expand: 'categoryId'
});

console.log(sameResult[0].categoryId);
// { id: "CAT-001", name: "Electronics", description: "..." }
```

Expand multiple relations, and combine with filters, sorting, and field selection:

```typescript
// Multiple relations
const orders = await sdk.collection('orders').getAll({
  expand: ['customerId', 'productId', 'warehouseId']
});

orders.forEach(order => {
  console.log(order.customerId.name);
  console.log(order.productId.name);
  console.log(order.warehouseId.location);
});

// Expand within a full query chain
const results = await sdk.collection('orders')
  .filter('status', '=', 'pending')
  .sort('created_dt', 'desc')
  .limit(50)
  .getAll({
    expand: ['customerId', 'productId']
  });

// Combine fields + expand
const trimmed = await sdk.collection('products').getAll({
  fields: ['id', 'name', 'price', 'categoryId'],
  expand: 'categoryId'
});
```

## Pagination with total count

Run a `count()` for the total and a paged `getAll()` for the rows. `offset` is the row
to start at; `limit` is the page size.

```typescript
async function getPaginatedProducts(page: number, pageSize: number) {
  const sdk = await getOrInitializeSDK();

  // Total count (same filters as the page)
  const total = await sdk.collection('products')
    .filter('status', '=', 'active')
    .count();

  // Page of data
  const products = await sdk.collection('products')
    .filter('status', '=', 'active')
    .sort('name', 'asc')
    .offset(page * pageSize)
    .limit(pageSize)
    .getAll();

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}
```

## Batch operations

There is no single bulk endpoint — process records in chunks and collect successes and
failures. The pattern below runs each chunk with `Promise.all`, supports
`continueOnError`, and builds the full id for updates and deletes.

```typescript
// filepath: src/services/batch-operations.service.ts (excerpt)
async batchCreate<T>(
  collectionName: string,
  records: Partial<T>[],
  options?: { continueOnError?: boolean; chunkSize?: number }
): Promise<BatchResults<T>> {
  const results: BatchResults<T> = {
    successful: [], failed: [], total: records.length, successCount: 0, failedCount: 0
  };

  const sdk = await this.getSDK();
  const chunkSize = options?.chunkSize || 10;
  const continueOnError = options?.continueOnError !== false;

  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(async (record) => {
      try {
        const created = await sdk.collection(collectionName).create(record);
        return { success: true, data: created };
      } catch (error: any) {
        return { success: false, error: error.message || 'Unknown error', data: record };
      }
    }));

    for (const result of chunkResults) {
      if (result.success && result.data) {
        results.successful.push(result.data);
        results.successCount++;
      } else {
        results.failed.push({ data: result.data, error: result.error || 'Unknown error' });
        results.failedCount++;
        if (!continueOnError) return results;
      }
    }
  }

  return results;
}
```

```typescript
import { batchOperationsService } from './services/batch-operations.service';

const createResults = await batchOperationsService.batchCreate('products', [
  { name: 'Product 1', price: 10 },
  { name: 'Product 2', price: 20 },
  { name: 'Product 3', price: 30 }
], { chunkSize: 10, continueOnError: true });

console.log(`Created: ${createResults.successCount}, Failed: ${createResults.failedCount}`);
```

## Field types

| Type       | Use case                                              | Example fields                  |
| ---------- | ----------------------------------------------------- | ------------------------------- |
| `string`   | Plain text, codes, free-form statuses                 | name, description, sku          |
| `enum`     | Predefined set of allowed string values               | priority, category, orderStatus |
| `url`      | URL strings (validated)                               | website, documentUrl            |
| `file`     | File references                                       | image, attachment, logo         |
| `editor`   | Rich text / HTML                                      | description, content, notes     |
| `number`   | Integers or decimals                                  | quantity, price, age, rating    |
| `boolean`  | True/false flags                                      | isActive, isVerified, enabled   |
| `date`     | Date and time values                                  | createdAt, dueDate, timestamp   |
| `json`     | JSON objects/arrays — query with `filterInArray`      | orderLines, metadata, config    |
| `record`   | Record ID (for the `id` field only)                   | id                              |
| `relation` | Reference to other collections                        | categoryId, userId, orderId     |

For an `enum` field, pass a plain string that matches one of the schema's `enumOptions`
— no special conversion needed (a TypeScript union type is a natural fit). For a
`relation` field, pass a `{ Table, ID }` object. For a `file` field, pass a `File`
object on write; see [File Handling](/sdk/file-handling/).

## Checklist

- [ ] `update`/`delete` use the full RecordID (`application_id.collection:id`).
- [ ] Relation fields written as `{ Table, ID }` objects.
- [ ] `update` understood as a PATCH (partial), not a full replace.
- [ ] Raw operators (`'='`, `'CONTAINS'`, …) and `offset`/`limit` used.
- [ ] `filterInArray` used for `json` array fields instead of loading everything.
- [ ] `expand` used only when full related records are needed.
- [ ] `fields` used to trim payloads.

## Next

- Learn the identifier rules in [Record IDs](/sdk/record-id/).
- Upload and retrieve files in [File Handling](/sdk/file-handling/).
- Organize this logic with the [service-layer architecture](/sdk/architecture/).
