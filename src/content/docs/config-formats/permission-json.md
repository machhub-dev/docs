---
title: Permission JSON
description: The JSON shape MACHHUB uses to import permission features and scopes — fields, behavior, and complete examples.
sidebar:
  order: 2
---

You can define **permission features and scopes** as JSON and import them from the
console's [Permissions](/console/permissions/) page. This drives the [authorization](/concepts/authorization/)
model — the *features*, *actions*, and *scopes* that [groups](/console/groups/) grant.

## Shape

```json
{
  "features": [
    {
      "name": "operator_panel",
      "description": "Access control for the operator panel",
      "actions": ["view", "create", "update", "delete"]
    },
    {
      "name": "reporting",
      "description": "Access control for reports",
      "actions": ["view", "export"]
    }
  ],
  "scopes": ["company", "self", "team"]
}
```

### `features[]`

| Field | Required | Meaning |
| --- | --- | --- |
| `name` | yes | Unique identifier, **no spaces**. If the name already exists it is updated; otherwise it is created. |
| `description` | no | Human-readable explanation. |
| `actions` | yes | A list of custom action verbs (e.g. `view`, `create`, `update`, `delete`, `export`). |

### `scopes`

A plain list of scope names (e.g. `company`, `team`, `self`). Existing scopes are
skipped (no duplicates). The `scopes` key can be omitted entirely.

## Behavior

:::tip[Safe to re-run]
Import **creates or updates only — it never deletes.** Re-running an import is safe
and idempotent; it will not remove features or scopes that aren't in the file.
:::

## Variants

**Features only** (omit scopes):

```json
{
  "features": [
    { "name": "dashboard", "actions": ["view"] }
  ]
}
```

**Scopes only** (extend the scope vocabulary without touching features):

```json
{
  "scopes": ["region", "site"]
}
```

## How it relates to authorization

Once imported, these **features** and **scopes** become assignable in
[Groups](/console/groups/): each group grants an **action** on a **feature** within a
**scope**. See [Authorization & Permissions](/concepts/authorization/) for the model
and [SDK → Authorization](/sdk/authorization/) for checking permissions in code.
