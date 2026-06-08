---
title: Settings & licensing
description: Configure device settings and activate your MACHHUB license from the console.
sidebar:
  order: 12
---

The **Settings** section holds device, network, backup, and licensing
configuration. It groups several pages: **General**, **Gateway**, **Firewall**,
**Network**, **License**, **Backups**, **Storage**, and **Log**.

## General

Under **Settings → General**, configure the device:

- **Device Name**
- **Listening IP**
- **Listening Port**

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Settings → General</strong> form.</div>
</figure>

## Gateway

Under **Settings → Gateway** you configure MACHHUB's built-in **Caddy reverse
proxy**. Define server blocks (listen addresses and routing directives such as
`reverse_proxy`, `handle_path`, `handle`, `rewrite`, `redir`, `tls`, and `encode`),
or switch to a raw custom-config mode to edit the Caddyfile directly.

## Firewall

Under **Settings → Firewall** you manage the host firewall (UFW): view status and
rules, open ports, and delete rules.

:::note[Linux only]
Firewall management supports **UFW on Linux** only. On other host platforms this page
is unavailable.
:::

## Network

Under **Settings → Network** you manage network interfaces and Wi-Fi: configure
interfaces, scan/connect/forget Wi-Fi networks, and manage saved connections.

:::note[Linux only]
Network management uses **NetworkManager on Linux** only. On other host platforms this
page is unavailable.
:::

## License

Under **Settings → License** you can see your license status, start a free trial, or
activate a license. To evaluate for free, click **Start 2-Hour Trial** on the banner — a
2-hour session starts with no key; re-start it (log in again) when it expires. See
[Licensing → Trial mode](/concepts/licensing/#trial-mode).

Activation is a short, multi-step flow:

1. Enter your **license key** and click **Generate Activation File** — this produces
   an activation file (`.txt`) from your key and the machine's fingerprint.
2. Exchange that activation file for a signed license file (`.mpl`).
3. **Upload the `.mpl`** to activate. The status updates to **Active** (also
   reflected on the [Home](/console/home/) dashboard).

Deactivation (including trial deactivation) is available from the same page. See
[Licensing](/concepts/licensing/) for the full model.

<figure>
  <div class="mh-shot">🎞️ GIF to capture: Settings → License → enter key → generate activation file → upload <code>.mpl</code> → status becomes Active.</div>
</figure>

## Backups & Storage

**Settings → Backups** configures scheduled backups, lets you trigger a backup or
restore, and lists prior backups. **Settings → Storage** shows disk/storage usage and
can run a cleanup. See [Upgrades & backups](/install/upgrades-backups/).

## Log

**Settings → Log** controls log retention — view and update the retention policy and
prune old logs.

## Related

- Concept: [Licensing](/concepts/licensing/)
