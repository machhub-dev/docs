---
title: Settings & licensing
description: Configure device settings and activate your MACHHUB license from the console.
sidebar:
  order: 12
---

The **Settings** section holds device configuration and licensing.

## General

Under **Settings → General**, configure the device:

- **Device Name**
- **Listening IP**
- **Listening Port**

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Settings → General</strong> form.</div>
</figure>

## Gateway

:::note[Planned]
The **Gateway** settings page is a placeholder in the current build.
:::

## License

Under **Settings → License** you can see your license status and activate a license.

Activation is done by **uploading your `.mpl` license file**:

1. Obtain your `.mpl` file (see [Licensing](/concepts/licensing/)).
2. Go to **Settings → License** and upload the file.
3. The status updates to **Active** (also reflected on the [Home](/console/home/)
   dashboard).

🎞️ *GIF to capture: Settings → License → upload a `.mpl` file → status becomes Active.*

:::note[Planned]
The on-screen activation-code (OTP) field is not yet wired — use the `.mpl` upload.
:::

## Related

- Concept: [Licensing](/concepts/licensing/)
- API: [Management API → License](/api/management/)
