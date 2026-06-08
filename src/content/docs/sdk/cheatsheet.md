---
title: API cheatsheet
description: A one-page reference of the MACHHUB SDK surface — every namespace and its key methods.
sidebar:
  order: 12
---

A quick reference to the whole `@machhub-dev/sdk-ts` surface. Follow the links for
details and examples.

## Setup

```ts
import { SDK } from '@machhub-dev/sdk-ts';
const sdk = new SDK();
await sdk.Initialize(/* config? */);
```

See [Install & initialize](/sdk/initialization/).

## Namespaces at a glance

| Namespace | Key methods | Guide |
| --- | --- | --- |
| `sdk.collection(name)` | `getAll`, `getOne`, `create`, `update`, `delete`, `filter`, `orFilter`, `sort`, `offset`, `limit`, `first`, `count`, `expand`, `fields`, `filterInArray` | [Collections](/sdk/collections/) |
| `sdk.auth` | `login`, `logout`, `getCurrentUser`, `getJWTData`, `validateCurrentUser`, `validateJWT` | [Authentication](/sdk/authentication/) |
| `sdk.auth` (authz) | `checkPermission`, `checkAction`, `getPermissions`, `getGroups`, `createGroup`, `addUserToGroup`, `getUsers`, `createUser` | [Authorization](/sdk/authorization/) |
| `sdk.tag` | `getAllTags`, `publish`, `subscribe`, `unsubscribe`, `getValue` | [Realtime](/sdk/realtime/) |
| `sdk.historian` | `query`, `getHistoricalDataAsCSV` | [Historian](/sdk/historian/) |
| `sdk.processes` | `execute`, `getProcesses`, `changeTriggers` | [Processes](/sdk/processes/) |

## Common snippets

```ts
// Query
await sdk.collection('products')
  .filter('inStock', '=', true)
  .sort('price', 'asc')
  .offset(0).limit(25)
  .getAll();

// Auth
await sdk.auth.login('username', 'password');
const me = await sdk.auth.getCurrentUser();

// Realtime
await sdk.tag.subscribe('line1/+/temperature', (v, topic) => console.log(topic, v));
await sdk.tag.publish('line1/oven/temperature', 72.4);

// Historian
await sdk.historian.query(`SELECT math::mean(value) AS avg FROM historian WHERE topic = 'line1/oven/temperature'`);

// Process
await sdk.processes.execute('computeAverage', { window: '1h' });
```

## RecordID

`application_id.collection:record_id` — e.g. `myapp.products:PROD-001`. Updates and
deletes need the full id; relations are written as `{ Table, ID }`. See
[RecordID](/sdk/record-id/).
