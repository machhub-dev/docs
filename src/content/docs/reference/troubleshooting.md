---
title: Troubleshooting
description: Common MACHHUB issues and their fixes — SDK initialization, MQTT in the browser, the Domain header, expired tokens, relations, and file fields.
sidebar:
  order: 4
---

Common problems and how to resolve them.

## `sdk.Initialize()` returns `false` or throws "requires browser environment"

The SDK is **client-side only**. It must run in the browser, not during server-side
rendering. Guard SSR paths (`if (typeof window === 'undefined') return`) and initialize
in a client lifecycle hook. For server-side data, call the REST API directly. See your
[framework guide](/frameworks/overview/).

## Realtime/tag subscriptions don't work in the browser

Browsers require **MQTT over WebSocket**, and over HTTPS that must be **`wss://`**.
Configure the MQTT URL accordingly (e.g. `wss://your-server:1884`), and make sure the
broker's WebSocket port is reachable. See [Realtime](/concepts/realtime/).

## Requests behave as the wrong tenant

If you omit the **`Domain`** header, requests default to `domains:machhub_admin`. Set
the header (or the SDK's `application_id`) to target the right
[domain](/concepts/domains/). On the data plane, the domain also name-prefixes your
tables.

## "Unauthorized" after a while

JWTs expire after the configured TTL, and there are **no refresh tokens** — log in
again to get a new token. See [Authentication](/concepts/authentication/).

## A relation update or delete fails

`update()` and `delete()` need the **full RecordID** (`myapp.products:PROD-001`), and
relations must be written as a reference object `{ Table, ID }` — not a bare string.
See [RecordID](/sdk/record-id/).

## A file field returns a filename instead of the file

Reading a record returns the file field as a **filename string**, not a URL. Fetch the
bytes with `getFile(fileName, fieldName, recordID)` to get a `Blob`, then
`URL.createObjectURL(blob)` to display it (and `revokeObjectURL` when done). See
[File handling](/sdk/file-handling/).

## CORS errors from a browser app

Enable CORS on the server and add your app's origin to `cors.origins`. See
[Configuration](/install/configuration/).

## The console shows "No active license"

Activate by uploading your `.mpl` file under **Settings → License**. See
[Licensing](/concepts/licensing/).

## A `tag_change` process didn't receive the new value

A `tag_change` trigger does not auto-inject the value. Add a **tag input** so the value
appears in `context.inputs`. See [the Process model](/processes/model/).
