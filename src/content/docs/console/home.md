---
title: Home dashboard
description: The MACHHUB console Home dashboard and its four at-a-glance stat cards.
sidebar:
  order: 3
---

**Home** (`/home`) is where you land after signing in. It is a lightweight dashboard
that gives you an at-a-glance overview of the current MACHHUB instance.

## Prerequisites

- A signed-in session. See [Logging in & domains](/console/login-and-domains/).
- No special permission is required to view Home.

## The stat cards

A row of four cards summarizes the instance. The counts are fetched from the API
(`GET /api/home`) when the page loads.

| Card | What it shows |
| --- | --- |
| **Total Users** | The number of user accounts. |
| **Total Groups** | The number of permission groups. |
| **Total Tags** | The number of tags across the Unified Namespace. |
| **License Status** | **Active** (green) or **Inactive** (orange), based on the current [license](/concepts/licensing/). |

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Home dashboard</strong> (`/home`) — the four stat cards (Users, Groups, Tags, License status). See <a href="/reference/shot-list/">shot-list</a> (#1).</div>
</figure>

Below the cards are two placeholder panels — **System Warnings** and **Report an
issue** — that are reserved for future use and have no content in this build.

## Where to go next

From Home, jump into the task you came to do:

- [Manage the Unified Namespace](/console/namespace/)
- [Build a Collection](/console/collections/)
- [Manage users](/console/users/) and [groups & permissions](/console/groups/)
- [Settings & licensing](/console/settings/)
