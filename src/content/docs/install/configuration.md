---
title: Configuration
description: Most MACHHUB settings are managed in the console. Change the device name and console port under Settings.
sidebar:
  order: 2
---

Most of MACHHUB's settings are managed visually in the **console** under
[**Settings**](/console/settings/) — the device name, network, firewall, backups, and
licensing. You rarely need to change anything by hand.

## Device name and console port

Go to **Settings → General** to set:

- the **device name**, and
- the **listening address and port** the console and API use (the default port is
  `6188`).

Apply the change, and restart MACHHUB if you're prompted to.

## Advanced

The installer also writes a configuration file with low-level options (such as the
listening host and port). Most deployments never need to touch it — prefer the
console settings above. If you do edit it, make a backup first and restart MACHHUB for
the changes to take effect.

Next: [First login & bootstrap](/install/first-login/).
