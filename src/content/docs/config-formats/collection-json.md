---
title: Collection JSON
description: The JSON schema MACHHUB uses to define collections — fields, types, relations, indexes, standard fields, and a complete example you can import.
sidebar:
  order: 1
---

You can define a [Collection](/concepts/collections/) as JSON and import it from the
console (**Database → Collections → Import**). This page documents the exact shape.

- **One collection** = a JSON **object**.
- **Many collections** = a JSON **array** of those objects.

## Shape

```jsonc
{
  "name": "customers",            // required, unique within the domain
  "description": "Customer master data",
  "fields": [ /* Field objects */ ],
  "indexDetails": [ /* Index objects, optional */ ]
}
```

### Field object

```jsonc
{
  "name": "email",
  "type": "string",        // see field types below
  "required": true,
  "onDelete": "ignore"     // ignore | unset | cascade | reject
}
```

Field types: `string`, `number`, `boolean`, `date`, `url`, `enum`, `json`, `editor`,
`file`, `relation`, `record`.

- **`record`** is reserved for the `id` field.
- **`enum`** requires a non-empty `enumOptions: string[]`.
- **`relation`** (use for **all** foreign keys) requires:
  - `relatedCollectionID`: `{ "Table": "collections", "ID": "<target collection id>" }`
  - `relationLinkType`: `"single"` or `"multiple"`

#### `onDelete` behavior

| Value | Effect when a referenced record is deleted |
| --- | --- |
| `ignore` | do nothing |
| `unset` | null the reference |
| `cascade` | delete this record too |
| `reject` | block the parent deletion |

### Index object

```jsonc
{ "fields": ["email"], "isUnique": true, "query": "" }
```

- Use **unique** indexes for natural keys.
- Use **non-unique** indexes for fields you filter on (including foreign keys).
- Multiple `fields` create a **composite** index.

## Standard fields

Always include these three — the backend manages their values:

```json
{ "name": "id", "type": "record", "required": true, "onDelete": "ignore" },
{ "name": "created_dt", "type": "date", "required": false, "onDelete": "ignore" },
{ "name": "updated_dt", "type": "date", "required": false, "onDelete": "ignore" }
```

:::caution
Do **not** provide values for `id` or `domain_id` on import — they are assigned by the
platform.
:::

## Complete example

A `customers` collection with a unique email index, plus an `orders` collection that
relates to it:

```json
[
  {
    "name": "customers",
    "description": "Customer master data",
    "fields": [
      { "name": "id", "type": "record", "required": true, "onDelete": "ignore" },
      { "name": "companyName", "type": "string", "required": true, "onDelete": "ignore" },
      { "name": "email", "type": "string", "required": true, "onDelete": "ignore" },
      { "name": "status", "type": "enum", "enumOptions": ["active", "inactive"], "required": false, "onDelete": "ignore" },
      { "name": "created_dt", "type": "date", "required": false, "onDelete": "ignore" },
      { "name": "updated_dt", "type": "date", "required": false, "onDelete": "ignore" }
    ],
    "indexDetails": [
      { "fields": ["email"], "isUnique": true, "query": "" },
      { "fields": ["status"], "isUnique": false, "query": "" }
    ]
  },
  {
    "name": "orders",
    "description": "Customer orders",
    "fields": [
      { "name": "id", "type": "record", "required": true, "onDelete": "ignore" },
      { "name": "reference", "type": "string", "required": true, "onDelete": "ignore" },
      {
        "name": "customerId",
        "type": "relation",
        "relatedCollectionID": { "Table": "collections", "ID": "customers_collection_id" },
        "relationLinkType": "single",
        "required": true,
        "onDelete": "cascade"
      },
      { "name": "total", "type": "number", "required": false, "onDelete": "ignore" }
    ]
  }
]
```

## Tips for modeling

- Create **parent** collections before **children** (so relation targets exist).
- Prefer `relation` over storing raw id strings — relations enable
  [expand](/sdk/collections/) and referential `onDelete` behavior.
- Keep one canonical collection per entity; use relations rather than duplicating data.

See also [Permission JSON](/config-formats/permission-json/) and the
[Collections concept](/concepts/collections/).
