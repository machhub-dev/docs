---
title: Quickstart
description: Go from zero to a working MACHHUB app — install the SDK, connect to MACHHUB Platform, create a collection, write a record, and subscribe to a live tag.
sidebar:
  order: 2
---

This quickstart takes you from nothing to a working MACHHUB app in a few minutes.
You will connect to a running **MACHHUB Platform**, create a **Collection**, write a
record, and subscribe to a live **Tag**.

:::note[Prerequisites]
- A reachable **MACHHUB Platform** instance (see [Install & Self-Hosting](/install/overview/) to run one locally).
- **Node.js 18+** and a package manager (`npm`, `pnpm`, or `yarn`).
- A MACHHUB **username/password** (the console bootstraps an admin user on first run; the default is `admin` / `admin`).
:::

## 1. Create a collection in the console

The fastest way to model data is the web console:

1. Open the console and sign in.
2. Go to **Database → Collections** and click **Add Collection**.
3. Name it `products`, then add fields — for example `name` (String), `sku` (String),
   `price` (Number), and `inStock` (Boolean). An `id` field is always created for you.
4. Save. You now have a `products` collection you can read and write from the SDK.

See [Build a Collection](/console/collections/) for the full walkthrough, or
[Collection JSON](/config-formats/collection-json/) to import a schema as JSON.

## 2. Install the SDK

```bash
npm install @machhub-dev/sdk-ts
```

## 3. Initialize the SDK

```ts
import { SDK } from '@machhub-dev/sdk-ts';

const sdk = new SDK();

// Recommended (dev and prod): no connection config. In development the MACHHUB
// Designer proxies your dev server's SDK requests to the connected platform; in
// production the app is hosted on MACHHUB, so the SDK resolves its connection.
await sdk.Initialize();

// Manual config — only when you self-host the app, target a different server/domain,
// or want to hardcode the connection:
// await sdk.Initialize({
//   application_id: 'myapp',
//   httpUrl: 'http://localhost:80',
//   mqttUrl: 'mqtt://localhost:1883',
// });
```

:::tip[Zero-config with the Designer]
If you install the [MACHHUB Designer](/designer/overview/) VS Code extension and
connect it to a MACHHUB Platform (your *MACHHUB Environment*), it proxies your dev
server's SDK requests to that platform — so in development you can skip the connection
details and simply call `await sdk.Initialize()`.
:::

## 4. Create and read records

```ts
// Create a product
await sdk.collection('products').create({
  name: 'Wireless Mouse',
  sku: 'MOUSE-001',
  price: 29.99,
  inStock: true,
});

// Query: in-stock products under $50, newest first
const cheap = await sdk
  .collection('products')
  .filter('inStock', '=', true)
  .filter('price', '<', 50)
  .sort('price', 'asc')
  .getAll();

console.log(cheap);
```

Record IDs use the form `application_id.collection:record_id`, e.g.
`myapp.products:PROD-001`. See [SDK → Collections](/sdk/collections/) for queries,
relations, pagination, and the full CRUD surface.

## 5. Subscribe to a live tag

Tags are live signals in the [Unified Namespace](/concepts/unified-namespace/),
delivered over MQTT.

```ts
// Subscribe to a tag and react to every new value
await sdk.tag.subscribe('line1/oven/temperature', (value) => {
  console.log('temperature =', value);
});

// Publish a value (e.g. from a gateway or a test)
await sdk.tag.publish('line1/oven/temperature', 72.4);
```

To **store history** for a tag, enable historization on it (see
[Historize a tag](/console/historize/)), then query it:

```ts
const rows = await sdk.historian.query(`
  SELECT time::floor(time, 1h) AS hour, math::mean(value) AS avg
  FROM historian
  WHERE topic = 'line1/oven/temperature'
  GROUP BY hour ORDER BY hour ASC
`);
```

## Next steps

- **Structure your app** with the [service-layer architecture](/sdk/architecture/).
- **Add auth** with [SDK → Authentication](/sdk/authentication/).
- **Pick your framework**: [Angular](/frameworks/angular/), [React/Next.js](/frameworks/nextjs-react/), [Vue/Nuxt](/frameworks/nuxt-vue/), or [SvelteKit](/frameworks/sveltekit-svelte/).
- **Automate logic** with [Processes](/processes/overview/).
