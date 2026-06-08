---
title: Permissions
description: Define custom features, their actions, and domain-wide scopes on the MACHHUB console Permissions page, and import or export them as JSON.
sidebar:
  order: 11
---

The **Permissions** page is where you define the **custom features**, **actions**, and
**scopes** that [groups](/console/groups/) grant. Find it under **Account →
Permissions**. Built-in features (Users, Groups, Upstreams, …) are always available;
this page is for the user-defined ones your applications need.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Custom Permissions list at /account/permissions</strong> — feature cards with action chips.</div>
</figure>

The header reads **Custom Permissions** — *"Define features, their allowed actions, and
available scopes. Assign permissions to groups via the Groups page."* Four controls sit
beside it: **Scopes**, **Export**, **Import**, and **+ New Feature**.

## Features

Each feature is a protected resource. Defined features appear as cards showing the
feature **name**, its **description**, and a chip per allowed **action** (e.g. `read`,
`create`, `update`, `delete`). Each card has **edit** (✏️) and **delete** (🗑️) actions.

### Add a feature

1. Click **+ New Feature**.
2. Fill in the inline card:
   - **Feature Name** — unique identifier, **no spaces** (e.g. `operator_panel`).
   - **Description** — optional, human-readable (e.g. `Operator panel access`).
   - **Actions** — type an action verb and add it; repeat for each (e.g. `read`,
     `create`, `update`, `delete`, `export`).
3. Click **Create**. (Or **Cancel** to discard.)

<figure>
  <div class="mh-shot">🎞️ GIF to capture: + New Feature → name + description + a few actions → Create → the card appears in the list.</div>
</figure>

Editing a feature lets you change its description and actions; deleting removes it.

## Domain Scopes

Click **Scopes** to open the **Domain Scopes** dialog — *"Scopes are domain-wide and
available for all features when assigning permissions to groups."*

Scopes narrow *which records* an action applies to. A domain starts with **no scopes**;
add the ones you need. Common ones are `all` (everything in the domain) and `self` (the
user's own records), plus custom ones such as `company` or `department`.

- **Add** — type a name in the field (*"e.g. company, department"*) and click **+**.
- **Remove** — click the 🗑️ beside a scope.
- **Close** when done.

Once defined, a scope is available to **every** feature when you assign permissions on
the [Groups](/console/groups/) page.

:::caution[Scope enforcement is your app's job]
MACHHUB **stores and returns** a permission's scope, but does **not** automatically
filter records by it. Enforcing what a scope means is the responsibility of the
**application you build**. See [Authorization & Permissions](/concepts/authorization/).
:::

## Import & export

- **Export** downloads the current features and scopes as JSON.
- **Import** loads features and scopes from a JSON file. Import **creates or updates
  only — it never deletes**, so re-running an import is safe and idempotent.

See [Permission JSON](/config-formats/permission-json/) for the exact file shape.

## How it maps to access

Features, actions, and scopes defined here become assignable in
[Groups](/console/groups/): each group grants an **`action:scope`** rule on a feature.
See [Authorization & Permissions](/concepts/authorization/) for the full model.

## Related

- [Groups & permissions](/console/groups/)
- [Users](/console/users/)
- [Permission JSON](/config-formats/permission-json/)
- [SDK → Authorization](/sdk/authorization/)
</content>
</invoke>
