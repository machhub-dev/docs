# MACHHUB Docs

Documentation site for **[MACHHUB](https://machhub.dev)** — the unified data fabric and
Industrial IoT (IIoT) platform. Published at
**[docs.machhub.dev](https://docs.machhub.dev)**.

Built with [Astro](https://astro.build) + the
[Starlight](https://starlight.astro.build) docs framework, with
[Mermaid](https://mermaid.js.org) diagrams.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- npm (ships with Node)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the local dev server (hot reload) |
| `npm run build`   | Build the production site to `./dist/`  |
| `npm run preview` | Preview the production build locally    |

## Project structure

```
src/
  content/docs/      Documentation pages (Markdown / MDX), grouped by section
  components/        Starlight component overrides (theme select, site title,
                     page title, mobile menu, …)
  assets/            Logos and images
  styles/custom.css  Site-wide custom styles
public/              Static assets served as-is (e.g. mermaid-zoom.js)
astro.config.mjs     Astro + Starlight config: sidebar, components, edit links
```

The sidebar is generated from the folder structure under `src/content/docs/`. Each
section is wired up in the `sidebar` array in [`astro.config.mjs`](astro.config.mjs);
page order within a section comes from the `sidebar.order` frontmatter field.

## Contributing

Documentation pages live in [`src/content/docs/`](src/content/docs/) as Markdown. To
edit a page, click **Contribute to this page** at the top of any page on the live site,
or edit the file directly and open a pull request.

When adding or editing pages:

- **Frontmatter** — every page needs `title` and `description`; use `sidebar.order` to
  position it within its section.
- **New pages** appear in the sidebar automatically based on their folder.
- **Links** between pages use root-relative paths (e.g. `/sdk/initialization/`).
- **Diagrams** use fenced ```mermaid``` code blocks.
- **Screenshot placeholders** use the `mh-shot` pattern (a `<figure>` with a
  `<div class="mh-shot">` describing the shot to capture) until a real asset is added.

Run `npm run build` before opening a PR to confirm the site builds and links resolve.

## License

© MACHHUB®. All rights reserved.
