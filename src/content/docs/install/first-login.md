---
title: First login & bootstrap
description: The admin domain, creating your first user, and signing in to the MACHHUB console for the first time.
sidebar:
  order: 4
---

After MACHHUB EDGE is running, you need a user account to sign in to the console.

## The admin domain

MACHHUB always has a built-in administrative [domain](/concepts/domains/),
`domains:machhub_admin`. This is the default tenant for requests that don't specify a
`Domain` header, and where platform administration (users, groups, applications)
happens.

Two group names are reserved:

- **`superuser`** — bypasses all permission checks.
- **`member`** — the baseline group.

## Create your first user

Bootstrap an initial user so you can log in. During development this is done with the
CLI:

```bash
# from the API project root
go run . add user
```

(There is a `scripts/dev/devAddUser.sh` helper for this.) Provide a username,
password, and at least one group.

## Sign in

```mermaid
sequenceDiagram
  participant You
  participant Console
  participant EDGE
  You->>Console: open the console URL
  You->>Console: enter username + password
  Console->>EDGE: POST /auth/login
  EDGE-->>Console: { success: true, tkn }
  Console-->>You: redirect to Home (token stored in the browser)
```

1. Open the console in a browser.
2. Enter your username and password and **Sign In**.
3. You land on the **Home** dashboard.

From here, continue with [Using the Console](/console/overview/) — create
[collections](/console/collections/), build your [Unified Namespace](/console/namespace/),
and add [users and groups](/console/users/).

:::tip[Activate your license]
A fresh install reports **No active license**. Upload your `.mpl` file under
**Settings → License** to activate. See [Licensing](/concepts/licensing/).
:::
