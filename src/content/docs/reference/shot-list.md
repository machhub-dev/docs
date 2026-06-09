---
title: Screenshot & GIF shot-list
description: The capture checklist for the documentation — which console screens to screenshot, which flows to record as GIFs, which Designer assets are still needed, and where to save each file.
sidebar:
  order: 2
---

This is the working checklist for the visual assets the docs need. The site currently
uses labeled placeholders (`📷` / `🎞️`); replace them as real captures come in.

Save each file to the listed **Save to** path. Convention:
`public/images/<section>/<name>` — referenced in pages as `/images/<section>/<name>`.
Screenshots are `.png`; motion is `.gif` (swap to `.mp4`/`.webp` if preferred).

:::tip[Capture settings]
For consistency, capture at a viewport around **1280×800**, hide personal data, and
record GIFs as short, single-purpose clips. Capture key screens in **both** light and
dark mode where it adds value (the UNS editor looks great in dark mode).
:::

## Console — hero screenshots

| Screen | Route | What to show | Save to | Used on |
| --- | --- | --- | --- | --- |
| Home dashboard | `/home` | The four stat cards (Users, Groups, Tags, License status). | `public/images/console/home-dashboard.png` | [Console overview](/console/overview/), [Home](/console/home/) |
| UNS editor | `/namespace/manage` | The 3-pane editor (namespace list · tree · tag details with live value). Signature shot — prefer dark mode. | `public/images/console/namespace-editor.png` | [Manage the UNS](/console/namespace/) |
| Historian | `/namespace/historian` | A clean time-series line chart with the tooltip visible. | `public/images/console/historian-chart.png` | [Historian](/console/historian/) |
| Collections | `/database/collections` | Two-pane view with a collection selected and several records. | `public/images/console/collections-two-pane.png` | [Build a Collection](/console/collections/) |
| Groups | `/account/groups` | Grid view showing permission cards (the RBAC visual). | `public/images/console/groups-grid.png` | [Groups & permissions](/console/groups/) |
| Group hierarchy | `/account/groups` | Configure Group Hierarchy drag-and-drop (Superuser highest, Member lowest). | `public/images/console/groups-hierarchy.png` | [Groups & permissions](/console/groups/) |
| Permissions | `/account/permissions` | Custom Permissions list — feature cards with action chips. | `public/images/console/permissions-list.png` | [Permissions](/console/permissions/) |
| Developer Keys | `/account/developer_keys` | The Developer Keys list. | `public/images/console/developer-keys-list.png` | [Developer Keys](/console/api-keys/) |
| Users | `/account/users` | The Users list. | `public/images/console/users-list.png` | [Users](/console/users/) |
| Profile | `/profile` | The profile page. | `public/images/console/profile.png` | [Profile](/console/profile/) |
| Settings → General | `/settings` | The General settings form. | `public/images/console/settings-general.png` | [Settings](/console/settings/) |
| Historize dialog | `/namespace/manage` | Historize dialog — Time Series with sampling + retention fields. | `public/images/console/historize-dialog.png` | [Historize a tag](/console/historize/) |
| Upstreams | `/connections/upstreams` | List — Host, Namespace Binding, Status (Approved), activate toggle. | `public/images/console/upstreams-list.png` | [Upstreams](/console/upstreams/) |
| Login | `/login` | The split-screen industrial-hall brand shot. | `public/images/console/login-hero.png` | [Logging in](/console/login-and-domains/) |
| Sidebar + domain switcher | any | Collapsed vs expanded sidebar; domain switcher open (System vs Application). | `public/images/console/sidebar-domain-switcher.png` | [Console overview](/console/overview/) |

## Console — GIF flows

| Flow | Steps to record | Save to | Used on |
| --- | --- | --- | --- |
| Login | Type credentials → Sign In → success toast → land on Home. | `public/images/console/login.gif` | [Logging in](/console/login-and-domains/) |
| Switch domain | Open domain switcher → pick an Application domain → sidebar nav narrows. | `public/images/console/switch-domain.gif` | [Logging in & domains](/console/login-and-domains/) |
| Create a collection | Add Collection → name it → add fields (String/Number/Relation) → Save → appears in list. | `public/images/console/collections-create.gif` | [Build a Collection](/console/collections/) |
| Add a record | Add Record → fill typed inputs (toggle a switch, pick a date, use the relation picker) → Save. | `public/images/console/collections-add-record.gif` | [Build a Collection](/console/collections/) |
| Add a folder & tag | Add Folder → Add Tag under it. | `public/images/console/namespace-add-folder-tag.gif` | [Manage the UNS](/console/namespace/) |
| Publish a live value | Select a tag → edit its value → Send → success toast. | `public/images/console/namespace-publish-value.gif` | [Manage the UNS](/console/namespace/) |
| Enable historize | Select tag → Historize dialog → toggle on → Time Series + sampling/retention → Save. | `public/images/console/historize-enable.gif` | [Historize a tag](/console/historize/) |
| Historian filters | Filters → pick tag/key/range → chart renders and updates. | `public/images/console/historian-filters.gif` | [Historian](/console/historian/) |
| Historian CSV export | Export dialog → select tags + date range → download with progress. | `public/images/console/historian-export.gif` | [Historian](/console/historian/) |
| Add a group | Add Group → name it → set features to Read / Read and Write → Save. | `public/images/console/groups-add.gif` | [Groups & permissions](/console/groups/) |
| Add a feature (permission) | + New Feature → name + description + actions → Create → card appears. | `public/images/console/permissions-new-feature.gif` | [Permissions](/console/permissions/) |
| Add a user | Add User → fill details → assign group(s) → Save → user appears. | `public/images/console/users-add.gif` | [Users](/console/users/) |
| License activation | Settings → License → enter key → generate activation file → upload `.mpl` → status Active. | `public/images/console/settings-license-activation.gif` | [Settings](/console/settings/) |
| Create an upstream | Create Upstream → host + ports → Request Connection → Accept on upstream server → Approved → add binding → activate toggle. | `public/images/console/upstreams-create.gif` | [Upstreams](/console/upstreams/) |

## Designer (VS Code)

| Asset | What to show | Save to | Used on |
| --- | --- | --- | --- |
| Runtime Connection panel | MACHHUB Runtime Connection — Configuration Profiles list + connection fields. | `public/images/designer/runtime-connection-panel.png` | [MACHHUB Designer](/designer/overview/) |
| Marketplace listing | The extension's Marketplace page. | `public/images/designer/marketplace-listing.png` | [MACHHUB Designer](/designer/overview/) |
| Connect → develop → deploy (GIF) | Connect to an Environment → `sdk.Initialize()` (proxied) → deploy from the sidebar. | `public/images/designer/connect-develop-deploy.gif` | [MACHHUB Designer](/designer/overview/) |
| Designer sidebar | Source/builds sections, the connected Environment, and the deploy action. | `public/images/designer/sidebar.png` | [MACHHUB Designer](/designer/overview/) |

## Concepts

| Asset | What to show | Save to | Used on |
| --- | --- | --- | --- |
| Applications + domain switcher | The Applications list plus the domain switcher. | `public/images/concepts/domains-applications-switcher.png` | [Domains](/concepts/domains/) |
| Namespace tree editor | Folders, a tag, and its access/historize settings. | `public/images/concepts/uns-tree-editor.png` | [Unified Namespace](/concepts/unified-namespace/) |
| Upstreams table + dialog | The Upstreams table and the Create/Edit dialog (connection details, Request Connection, bindings, activate toggle). | `public/images/concepts/upstreams-table-dialog.png` | [Upstreams](/concepts/upstreams/) |

## Diagrams (already generated)

Architecture, data-model, process, and realtime diagrams are authored as
[Mermaid](/reference/editing-docs/#diagrams-mermaid) and need no capture —
edit them inline in the relevant pages.

:::note[Do not screenshot these]
Some console areas are still incomplete in the current build (self-service signup).
Avoid featuring them in screenshots until they ship.
:::
