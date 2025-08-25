import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import markdownit from 'markdown-it'
import vue from '@vitejs/plugin-vue';

import { description } from './package.json';

// Convert changelog from markdown to HTML
const changelog_md: string = fs.readFileSync('./CHANGELOG.md', 'utf-8');
const changelog_html: string = markdownit({
  typographer: true, // needed to convert '--' to en-dash
}).render(changelog_md.slice(changelog_md.indexOf('\n') + 1)) // render without h1 on first line
  .replace(/\n/g, ' '); // join lines together

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        not_found: resolve(__dirname, '404.html'),
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      injectRegister: 'inline',
      manifest: {
        name: 'Running Tools',
        short_name: 'Running Tools',
        description: description,
        theme_color: '#ff8000',
        background_color: '#ff8000',
        icons: [
          {
            "src": "./img/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
          },
          {
            "src": "./img/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
          },
          {
            "src": "./img/icons/android-chrome-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable",
          },
          {
            "src": "./img/icons/android-chrome-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: process.env.BASE_URL || '/',
  define: {
    'import.meta.env.VITE_DESCRIPTION': `"${description}"`,
    'import.meta.env.VITE_DOMAIN': process.env.DOMAIN ? `"https://${process.env.DOMAIN}"` : '""',
    '__CHANGELOG_HTML__': JSON.stringify(changelog_html),
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
