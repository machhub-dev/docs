---
title: Screenshot & GIF shot-list
description: The capture checklist for the documentation — which console screens to screenshot, which flows to record as GIFs, and which Designer assets are still needed.
sidebar:
  order: 2
---

This is the working checklist for the visual assets the docs need. The site currently
uses labeled placeholders (`📷` / `🎞️`); replace them as real captures come in.

:::tip[Capture settings]
For consistency, capture at a viewport around **1280×800**, hide personal data, and
record GIFs as short, single-purpose clips. Capture key screens in **both** light and
dark mode where it adds value (the UNS editor looks great in dark mode).
:::

## Console — hero screenshots

| # | Screen | Route | What to show | Used on |
| --- | --- | --- | --- | --- |
| 1 | Home dashboard | `/home` | The four stat cards (Users, Groups, Tags, License status). | [Console overview](/console/overview/) |
| 2 | UNS editor | `/namespace/manage` | The 3-pane editor (namespace list · tree · tag details with live value). The signature product shot — prefer dark mode. | [Manage the UNS](/console/namespace/) |
| 3 | Historian | `/namespace/historian` | A clean time-series line chart with the tooltip visible. | [Historian](/console/historian/) |
| 4 | Collections | `/database/collections` | Two-pane view with a collection selected and several records. | [Build a Collection](/console/collections/) |
| 5 | Groups | `/account/groups` | Grid view showing permission cards (the RBAC visual). | [Groups & permissions](/console/groups/) |
| 6 | Login | `/login` | The split-screen industrial-hall brand shot. | [Logging in](/console/login-and-domains/) |
| 7 | Sidebar + domain switcher | any | Collapsed vs expanded sidebar; domain switcher open (System vs Application). | [Console overview](/console/overview/) |

## Console — GIF flows

| # | Flow | Steps to record | Used on |
| --- | --- | --- | --- |
| 1 | Login | Type credentials → Sign In → success toast → land on Home. | [Logging in](/console/login-and-domains/) |
| 2 | Create a collection | Add Collection → name it → add fields (String/Number/Relation) → Save → appears in list. | [Build a Collection](/console/collections/) |
| 3 | Add a record | Add Record → fill typed inputs (toggle a switch, pick a date, use the relation picker) → Save. | [Build a Collection](/console/collections/) |
| 4 | Add & historize a tag | Add Folder → Add Tag → select tag → Historize dialog → Time Series + sampling/retention → Save. | [Historize a tag](/console/historize/) |
| 5 | Publish a live value | Select a tag → edit its value → Send → success toast. | [Manage the UNS](/console/namespace/) |
| 6 | Create an upstream | Create Upstream → host + ports → Request Connection → Accept on upstream server (Incoming Requests) → Approved → add binding → activate toggle. | [Upstreams](/console/upstreams/) |
| 7 | Historian + CSV export | Filters → pick tag/key/range → chart renders → Export → select tags + date range → download. | [Historian](/console/historian/) |
| 8 | Switch domain | Open domain switcher → pick an Application domain → sidebar nav narrows. | [Logging in & domains](/console/login-and-domains/) |

## Designer (VS Code) — assets still needed

| # | Asset | What to show | Used on |
| --- | --- | --- | --- |
| 1 | Marketplace listing | The extension's Marketplace page (and the exact extension ID). | [MACHHUB Designer](/designer/overview/) |
| 2 | Connect → develop → deploy (GIF) | Connect to a MACHHUB Environment → `sdk.Initialize()` (proxied to the platform) → deploy the project from the sidebar. | [MACHHUB Designer](/designer/overview/) |
| 3 | Designer sidebar | Source/builds sections, the connected MACHHUB Environment, and the deploy action. | [MACHHUB Designer](/designer/overview/) |

## Diagrams (already generated)

Architecture, data-model, process, and realtime diagrams are authored as
[Mermaid](/reference/editing-docs/#diagrams-mermaid) and need no capture —
edit them inline in the relevant pages.

:::note[Do not screenshot these]
Some console areas are still incomplete in the current build (self-service signup).
Avoid featuring them in screenshots until they ship.
:::
