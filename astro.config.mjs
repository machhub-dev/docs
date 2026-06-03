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
      title: 'MACHHUB Docs',
      description:
        'Documentation for MACHHUB — the unified data fabric and Industrial IoT (IIoT) platform. Learn the concepts (Collections, Processes, Flows, Historian, Realtime/MQTT, UNS), install and configure MACHHUB EDGE, navigate the console, and build apps with the TypeScript SDK and the MACHHUB Designer.',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'MACHHUB',
      },
      favicon: '/favicon.svg',
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/machhub-dev' },
        { icon: 'external', label: 'machhub.dev', href: 'https://machhub.dev' },
      ],
      editLink: {
        baseUrl: 'https://github.com/machhub-dev/docs/edit/main/',
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
