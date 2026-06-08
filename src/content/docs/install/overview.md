---
title: Install & Self-Hosting Overview
description: Install MACHHUB by downloading the installer for Linux or Windows from the MACHHUB website, then open the console in your browser.
sidebar:
  order: 1
---

MACHHUB is **self-hosted** — it runs on your own machine or server, on your network,
with your data staying with you. There's nothing to wire together: a single download
includes everything MACHHUB needs and runs as a background service.

## Install with the installer

1. Download the installer for your operating system — **Linux** or **Windows** —
   from the [MACHHUB website](https://machhub.dev/install).
2. Run the installer. It sets up MACHHUB and starts it as a service that launches
   automatically on boot.
3. Open the console in your browser at the address shown after installation
   (by default `http://localhost`, or `http://localhost:6188` — both work).
4. Sign in and finish setup — see [First login & bootstrap](/install/first-login/).

That's it — no separate database or message broker to install.

## Requirements

| | Recommendation |
| --- | --- |
| Operating system | 64-bit **Linux** or **Windows**. ARM64 (e.g. Raspberry Pi) is supported on Linux. |
| RAM | At least **4 GB**. |
| Storage | At least **32 GB** (more for large data/history workloads). |
| Network | A browser-reachable address for the console. If devices or other machines connect, make sure the console and MQTT ports are reachable. |

### Minimum CPU

A modern multi-core CPU at or above one of these baselines:

| Architecture | Minimum CPU |
| --- | --- |
| **Intel** | Atom x5-Z8350, or Celeron N3350 |
| **AMD** | A4-9120, or E1-6010 |
| **ARM** | Quad-core Cortex-A72 |

## After installing

- [First login & bootstrap](/install/first-login/) — sign in as the administrator and
  activate your license.
- [Configuration](/install/configuration/) — change the device name and ports.
- [Upgrades & backups](/install/upgrades-backups/) — keep MACHHUB up to date and
  protect your data.

Once MACHHUB is running, head to [Using the Console](/console/overview/) or the
[SDK Quickstart](/start-here/quickstart/).
