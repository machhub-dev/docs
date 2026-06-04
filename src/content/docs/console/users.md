---
title: Users
description: Create and manage user accounts in the MACHHUB console, including profile details and group membership.
sidebar:
  order: 9
---

Manage people under **Account → Users**. The page offers a grid view and a list view
of all users in the current [domain](/concepts/domains/).

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Users list at /account/users</strong>.</div>
</figure>

## Add a user

1. Click **Add User**.
2. Fill in the details:
   - Avatar (optional image upload)
   - First and last name
   - Username
   - Contact number
   - Email
   - Password
   - One or more **domain group(s)** — this determines the user's
     [permissions](/console/groups/).
3. Save.

🎞️ *GIF to capture: Add User → fill details → assign group(s) → Save → the user appears in the list.*

## Edit a user

Use a row action to edit a user's profile. Password resets are available per user.

## Permissions come from groups

A user's access is the union of the [groups](/console/groups/) they belong to. To
change what someone can do, change their group membership or the group's permissions.
See [Authorization](/concepts/authorization/).

## Related

- [Groups & permissions](/console/groups/)
- [Your own profile](/console/profile/)
- [SDK → Authentication](/sdk/authentication/) and [Authorization](/sdk/authorization/)
