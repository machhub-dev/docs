---
title: Logging in & domains
description: Sign in to the MACHHUB console with a username and password, switch between System and Application domains, and log out.
sidebar:
  order: 2
---

This page covers getting into the console: signing in at `/login`, how the console
keeps your session, switching the active [Domain](/concepts/domains/), and logging
out. Switching domains is the single most important thing to understand before you
start clicking around — it changes both the data you see and which navigation
sections are available.

## Prerequisites

- A reachable MACHHUB instance. The console reads its connection settings from build-
  time environment variables: `PUBLIC_API_URL` (the REST API base) and
  `PUBLIC_API_MQTT_HOST` / `PUBLIC_API_MQTT_PORT` (the MQTT-over-WebSocket broker used
  for live tag values).
- A user account with a username and password. There is no self-service sign-up in
  this build (see below).

## Signing in

Open the console and you land on the **Login** screen — a split layout with the brand
image on the left and the form on the right.

1. Enter your **Username**.
2. Enter your **Password**.
3. Click **Sign In**.

On success you see a *Login Successful* toast and are taken to the **Home** dashboard.

<figure>
  <div class="mh-shot">🎞️ GIF to record: <strong>Login</strong> — type credentials → Sign In → success toast → land on Home. See <a href="/reference/shot-list/">shot-list</a> (Console GIF #1).</div>
</figure>

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Login</strong> (`/login`) — the split-screen industrial-hall brand shot. See shot-list (#6).</div>
</figure>

### How your session is stored

Signing in calls `POST /auth/login` with your `{ username, password }`. The API
returns an EdDSA-signed JWT in the `tkn` field. The console then stores two values in
the browser's `localStorage`:

| Key | Value |
| --- | --- |
| `x-machhub-auth-tkn` | Your JWT. Sent as `Authorization: Bearer <jwt>` on API calls. |
| `x-machhub-domain` | The active domain, set to `domains:machhub_admin` on login. Sent as the `Domain` header on API calls. |

Because the token lives in the browser, returning to `/login` while a valid token is
present sends you straight on to the app. There are no refresh tokens — when a JWT
expires you simply sign in again. For the underlying endpoint and credential formats,
see [API · Authentication](/api/authentication/).

:::note[No self-service sign-up]
The login screen links to a **Sign up** page, but account self-registration is
**planned and not yet available** in this build. Accounts are created by an
administrator under [Account · Users](/console/users/).
:::

## The domain switcher

A [Domain](/concepts/domains/) is a tenant. At the very top of the sidebar is the
**domain switcher**, showing the active domain's name and a chevron. Clicking it opens
a menu that groups domains under two headings:

- **System** — the built-in **MACHHUB / ADMINISTRATOR** domain
  (`domains:machhub_admin`, the default after login) and the Node-RED system domain.
- **Application** — any [Application domains](/concepts/domains/) you have created.

Selecting a domain writes its ID to `localStorage['x-machhub-domain']`, so every
subsequent API request carries the matching `Domain` header. Each domain row also has
a **star** action to set it as your default domain, and the menu has an **Add Domain**
action for creating a new Application domain.

<figure>
  <div class="mh-shot">🎞️ GIF to record: <strong>Switch domain</strong> — open the domain switcher → pick an Application domain → the sidebar nav narrows. See shot-list (Console GIF #9).</div>
</figure>

### Switching changes the visible navigation

The set of sidebar sections depends on the active domain:

| Active domain | Sections shown |
| --- | --- |
| **MACHHUB / Administrator** (`domains:machhub_admin`) | **Home**, **Applications**, **Dashboard**, **Flows**, **Processes**, plus **Account**, **Namespace**, **Connections**, **Integration**, **Database**, **Settings**, and **Support**. |
| Any **Application** domain | **Home**, **Dashboard**, **Flows**, **Processes**, plus **Account**, **Namespace**, **Connections**, **Integration**, and **Database** (the MQTT page is hidden). |

In other words, the **Applications** entry and the platform-wide **Settings** and
**Support** sections appear only in the admin domain. Application domains still expose
**Account** (users, groups, permissions, developer keys), the **Namespace**,
**Connections**, **Integration**, and **Database** — only the admin-only MQTT page is
hidden.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Sidebar + domain switcher</strong> — collapsed vs expanded sidebar, switcher open (System vs Application). See shot-list (#7).</div>
</figure>

## Logging out

Open the **user menu** at the bottom of the sidebar (your avatar, name, and email).
It offers a light/dark theme toggle, **Edit Profile** (see [Profile](/console/profile/)),
and **Log out**. Logging out removes both `x-machhub-auth-tkn` and
`x-machhub-domain` from `localStorage` and returns you to `/login`.

## Related

- [Console Overview](/console/overview/) — the shell, sidebar, and breadcrumb.
- [Domains](/concepts/domains/) — what tenants are and how they isolate data.
- [API · Authentication](/api/authentication/) — login endpoint, JWTs, and the `Domain` header.
