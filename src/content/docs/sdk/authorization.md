---
title: Authorization
description: Check permissions and actions, list domain permissions, and manage groups and users with the MACHHUB SDK auth namespace.
sidebar:
  order: 5
---

Authorization in MACHHUB is built from three concepts:

- **Feature** — a resource or capability, e.g. `"collections"`, `"users"`, `"flows"`.
- **Action** — `"read"`, `"read-write"`, or any custom string.
- **Scope** — `"self"` (own data), `"domain"` (domain-wide), `"nil"` (no scope
  restriction), or any custom string.
- **Group** — a named set of users that share a set of permissions.

All of these are reached through `sdk.auth`. You must be authenticated first — see
[Authentication](/sdk/authentication/).

## Checking permissions

### Check a single permission

```typescript
// Returns { permission: boolean }
const { permission } = await sdk.auth.checkPermission(
  'collections',   // feature
  'read',          // action: 'read' | 'read-write' | custom
  'domain'         // scope: 'self' | 'domain' | 'nil' | custom
);

if (permission) {
  // User has access
}
```

Signature: `checkPermission(feature: string, action: string, scope: string): Promise<PermissionResponse>`

### Get all allowed actions for a feature

```typescript
// Returns { actions: string[] }
const { actions } = await sdk.auth.checkAction('collections', 'domain');
// e.g. actions = ['read', 'read-write']
```

Signature: `checkAction(feature: string, scope: string): Promise<ActionResponse>`

### List all permissions in the domain

```typescript
// Returns Feature[] — every permission defined across all groups in the domain
const permissions = await sdk.auth.getPermissions();
// e.g. [{ name: 'collections', action: 'read-write', scope: 'domain' }, ...]
```

Signature: `getPermissions(): Promise<Feature[]>`

### The `Feature` shape

```typescript
import type { Feature } from '@machhub-dev/sdk-ts';

const feature: Feature = {
  name: 'collections',     // a feature name (see the table below)
  action: 'read-write',    // 'read' | 'read-write' | custom
  scope: 'domain'          // 'self' | 'domain' | 'nil' | custom
};
```

## Group management

### Get all groups

```typescript
const groups = await sdk.auth.getGroups();
// Each group: { id, name, features: [{ name, action, scope, domain }], user_ids }
```

### Create a group

```typescript
import type { Feature } from '@machhub-dev/sdk-ts';

const features: Feature[] = [
  { name: 'collections', action: 'read', scope: 'domain' },
];

const group = await sdk.auth.createGroup('Editors', features);
// Returns: { id, name, ... }
```

Signature: `createGroup(name: string, features: Feature[]): Promise<Group>`

:::caution
The group name `"Superuser"` is **reserved** and will be rejected.
:::

### Add permissions to a group

Each permission entry must use a valid scope: `"self"`, `"domain"`, or `"nil"`.

```typescript
import type { Feature } from '@machhub-dev/sdk-ts';

const permissions: Feature[] = [
  { name: 'collections', action: 'read-write', scope: 'domain' },
  { name: 'flows',       action: 'read',       scope: 'domain' },
  { name: 'api_keys',    action: 'read-write', scope: 'self'   },
];

await sdk.auth.addPermissionsToGroup(groupId, permissions);
```

Signature: `addPermissionsToGroup(group_id: string, permissions: Feature[]): Promise<ActionResponse>`

### Add a user to a group

```typescript
await sdk.auth.addUserToGroup(userId, groupId);
```

Signature: `addUserToGroup(userId: string, groupId: string): Promise<ActionResponse>`

## User management

```typescript
// List all users
const users = await sdk.auth.getUsers();

// Get a user by id
const user = await sdk.auth.getUserById(userId);

// Create a user
await sdk.auth.createUser(
  'Jane',               // firstName
  'Smith',              // lastName
  'janesmith',          // username
  'jane@example.com',   // email
  'securePassword123',  // password
  '+60123456789',       // phone number
  null                  // userImage (base64 string or null)
);
```

Signature: `createUser(firstName, lastName, username, email, password, number, userImage): Promise<User>`

## Getting the current user's groups and permissions

The current user carries `group_ids`; cross-reference them against all domain groups to
collect the user's effective permissions.

```typescript
import { RecordIDToString } from '@machhub-dev/sdk-ts';

// 1. Get user + their group IDs
const user = await sdk.auth.getCurrentUser();
const groupIds = user.group_ids ?? [];

// 2. Get all domain groups
const allGroups = await sdk.auth.getGroups();

// 3. Filter to the ones this user belongs to
const userGroups = allGroups.filter(group => {
  if (!group.id) return false;
  return groupIds.includes(RecordIDToString(group.id));
});

// 4. Collect all permissions across the user's groups
const allPermissions = userGroups.flatMap(g => g.features ?? []);
```

## Service and guard patterns

Centralize checks in an authorization service and protect routes/UI with a guard, in
keeping with the [service-layer architecture](/sdk/architecture/).

```typescript
// services/authorization.service.ts
import { getOrInitializeSDK } from './sdk.service';
import type { Feature } from '@machhub-dev/sdk-ts';

class AuthorizationService {
  async canAccess(feature: string, action: string, scope: string): Promise<boolean> {
    try {
      const sdk = await getOrInitializeSDK();
      const { permission } = await sdk.auth.checkPermission(feature, action, scope);
      return permission;
    } catch {
      return false;
    }
  }

  async getAllowedActions(feature: string, scope: string): Promise<string[]> {
    try {
      const sdk = await getOrInitializeSDK();
      const { actions } = await sdk.auth.checkAction(feature, scope);
      return actions ?? [];
    } catch {
      return [];
    }
  }

  async getDomainPermissions(): Promise<Feature[]> {
    try {
      const sdk = await getOrInitializeSDK();
      return await sdk.auth.getPermissions();
    } catch {
      return [];
    }
  }
}

export const authorizationService = new AuthorizationService();
```

```typescript
// guards/permission.guard.ts
import { authorizationService } from '../services/authorization.service';

export async function requirePermission(
  feature: string,
  action: string,
  scope: string,
  redirectTo = '/unauthorized'
): Promise<boolean> {
  const allowed = await authorizationService.canAccess(feature, action, scope);
  if (!allowed) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Usage
const canEdit = await requirePermission('collections', 'read-write', 'domain');
```

## Built-in feature names

Use these values for the `name` field in `Feature`. You may also use custom feature
names for application-specific permissions.

| Feature name        | Description                   |
| ------------------- | ----------------------------- |
| `applications`      | Manage applications           |
| `users`             | Manage user accounts          |
| `groups`            | Manage groups and permissions |
| `api_keys`          | Manage API keys               |
| `upstreams`         | Manage upstream connections   |
| `collections`       | Manage data collections       |
| `flows`             | Node-RED flow management       |
| `historian`         | Time-series historian data    |
| `processes`         | Manage processes              |
| `general_settings`  | General system settings       |
| `gateway`           | Gateway configuration         |
| `logs`              | Access system logs            |
| `dashboard`         | Dashboard access              |
| `integration`      | Integration management        |
| `manage_namespace`  | Manage namespaces             |
| `license`           | License management            |

## Checklist

- [ ] `checkPermission` called before sensitive mutations.
- [ ] `checkAction` used to show/hide UI controls dynamically.
- [ ] `getPermissions` used to display the domain's full permission set.
- [ ] `addPermissionsToGroup` uses valid scopes: `self`, `domain`, or `nil`.
- [ ] `createGroup` avoids the reserved name `"Superuser"`.
- [ ] Permission checks on route entry, not only on data fetch.

## Next

- Review login and sessions in [Authentication](/sdk/authentication/).
- See the full API surface in the [Cheat Sheet](/sdk/cheatsheet/).
