// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.machhub.dev',
  integrations: [
    // astro-mermaid must run before Starlight so it can transform ```mermaid
    // fenced code blocks into client-rendered, theme-aware diagrams.
    mermaid({
      theme: 'default',
      autoTheme: true,
    }),
    starlight({
      title: 'MACHHUB',
      description:
        'Documentation for MACHHUB — the unified data fabric and Industrial IoT (IIoT) platform. Learn the concepts (Collections, Processes, Flows, Historian, Realtime/MQTT, UNS), install and configure MACHHUB Platform, navigate the console, and build apps with the TypeScript SDK and the MACHHUB Designer.',
      logo: {
        light: './src/assets/machhub-logo-light.svg',
        dark: './src/assets/machhub-logo-dark.svg',
        alt: 'MACHHUB',
      },
      favicon: '/favicon.svg',
      // Load Lato (Black / weight 900) for the MACHHUB wordmark in the header.
      head: [
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        },
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Lato:wght@900&display=swap',
          },
        },
        // Zoom + fullscreen controls for Mermaid diagrams (public/mermaid-zoom.js).
        {
          tag: 'script',
          attrs: { src: '/mermaid-zoom.js', defer: true },
        },
      ],
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      components: {
        // Custom theme switcher — styled button + listbox instead of native <select>.
        ThemeSelect: './src/components/ThemeSelect.astro',
        // Custom site title — adds a "docs" badge + the mobile theme toggle.
        SiteTitle: './src/components/SiteTitle.astro',
        // Mobile drawer footer — drops the theme dropdown (mobile uses the header toggle).
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        // Page title — adds a "Contribute to this page" button above each heading.
        PageTitle: './src/components/PageTitle.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/machhub-dev' },
        { icon: 'external', label: 'machhub.dev', href: 'https://machhub.dev' },
      ],
      editLink: {
        baseUrl: 'https://github.com/machhub-dev/docs/edit/master/',
      },
      sidebar: [
        { label: 'Start Here', items: [{ autogenerate: { directory: 'start-here' } }] },
        { label: 'Core Concepts', items: [{ autogenerate: { directory: 'concepts' } }] },
        { label: 'Install & Self-Hosting', items: [{ autogenerate: { directory: 'install' } }] },
        { label: 'Using the Console', items: [{ autogenerate: { directory: 'console' } }] },
        { label: 'TypeScript SDK', items: [{ autogenerate: { directory: 'sdk' } }] },
        { label: 'Framework Guides', items: [{ autogenerate: { directory: 'frameworks' } }] },
        { label: 'Authoring Processes', items: [{ autogenerate: { directory: 'processes' } }] },
        { label: 'Configuration Formats', items: [{ autogenerate: { directory: 'config-formats' } }] },
        { label: 'REST API Reference', items: [{ autogenerate: { directory: 'api' } }] },
        { label: 'MACHHUB Designer (VS Code)', items: [{ autogenerate: { directory: 'designer' } }] },
        { label: 'AI Agent Skills', items: [{ autogenerate: { directory: 'skills' } }] },
        { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
      ],
    }),
  ],
});
