---
title: Conventions & errors
description: Response shapes, the App-CorrelationID header, list query parameters, and a security note on the current build's auth gaps.
sidebar:
  order: 5
---

This page covers the response conventions shared across the MACHHUB REST API:
success and error shapes, the correlation header, and the list query-parameter
grammar.

## Success responses

Successful responses are JSON. Many endpoints wrap their payload in a `success`
envelope:

```json
{ "success": true }
```

```json
{ "success": true, "status": { "active": true, "type": "trial" } }
```

List and get endpoints often return the data directly (an array or object) rather
than an envelope. Treat a `2xx` status as success and read the body accordingly.

## Error responses

Errors return an appropriate HTTP status with a **plain-text** message body — not
JSON. For example, a failed login returns:

```http
HTTP/1.1 401 Unauthorized
Content-Type: text/plain

Invalid Username or Password
```

Common statuses you will see:

| Status | Meaning |
| --- | --- |
| `400 Bad Request` | Malformed body or invalid parameter (e.g. bad Domain ID) |
| `401 Unauthorized` | Missing/invalid credential, or action not allowed |
| `409 Conflict` | Resource already exists (e.g. duplicate collection or upstream) |
| `422 Unprocessable Content` | Valid request, unacceptable content (e.g. wrong file type) |
| `500 Internal Server Error` | Unexpected server-side failure |
| `503 Service Unavailable` | A dependency could not be reached (e.g. an upstream broker) |

Because error bodies are plain text, read them as text rather than parsing JSON:

```ts
if (!response.ok) {
  const message = await response.text();
  throw new Error(message || `HTTP ${response.status}`);
}
```

## The `App-CorrelationID` header

Every response carries an **`App-CorrelationID`** header. The value is assigned per
request by the correlation middleware and is included in server log lines, so quote
it when reporting an issue to correlate a client failure with server logs.

```http
HTTP/1.1 200 OK
App-CorrelationID: 6f1c2a9e-1b34-4f0a-9c2e-77f0b1a2c3d4
```

## List query parameters

List endpoints (for example
[`GET /machhub/:table_name/all`](/api/data-plane/#records-generic-crud)) accept query
parameters for filtering, sorting, and pagination:

| Parameter | Form | Example |
| --- | --- | --- |
| Filter | `filter[field][op][type]=value` | `filter[status][eq][string]=active` |
| Sort | `sort=[field][dir]` | `sort=[created_dt][desc]` |
| Limit | `limit=<n>` | `limit=50` |
| Offset | `offset=<n>` | `offset=100` |

```http
GET /machhub/products/all?filter[price][gt][number]=10&sort=[name][asc]&limit=20&offset=0
```

The [SDK](/sdk/collections/) builds these for you through its fluent query API, so you
rarely assemble them by hand.

## Security

:::caution[Verify enforcement before exposing the Platform]
In the current build, much of the `/machhub/*` data plane is **unauthenticated** by
default, and some per-route permission gates are not yet fully enforced in code. Until
enforcement is fully enabled:

- Put MACHHUB Platform behind appropriate **network controls** (private network, reverse
  proxy, firewall, VPN) rather than exposing it directly to the internet.
- **Verify the enforcement state** for your specific deployment before trusting any
  endpoint to be access-controlled.
- Treat write endpoints (record CRUD, flow/function execution, designer uploads) as
  privileged regardless of whether a check currently fires.
:::

## Related

- API: [Authentication](/api/authentication/), [Data plane](/api/data-plane/)
- Reference: [Troubleshooting](/reference/troubleshooting/)
