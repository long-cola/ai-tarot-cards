import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
type PrerenderPluginFactory = typeof import('vite-plugin-prerender');
type PuppeteerRendererCtor = typeof import('@prerenderer/renderer-puppeteer');

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const plugins = [
    react(),
    sitemap({
      hostname: 'https://ai-tarotcard.com',
      dynamicRoutes: [
        '/topics',
        '/tarot-card-generator',
        '/one-card-tarot',
        '/random-tarot-card-generator',
        '/tarot-spreads',
        '/celtic-cross-tarot',
        // Note: Individual share pages can be submitted separately via sitemap generation
      ],
      exclude: ['/admin', '/admin.html', '/api'],
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0]
    }),
  ];

  if (mode === 'production') {
    try {
      const { prerender } = (await import('vite-plugin-prerender')) as PrerenderPluginFactory;
      const PuppeteerRenderer = (await import('@prerenderer/renderer-puppeteer')) as PuppeteerRendererCtor;

      plugins.push(
        prerender({
          routes: [
            '/tarot-card-generator',
            '/one-card-tarot',
            '/random-tarot-card-generator',
            '/tarot-spreads',
            '/celtic-cross-tarot',
          ],
          renderer: new PuppeteerRenderer.default({
            renderAfterDocumentEvent: 'prerender-ready',
          }),
        })
      );
    } catch (error) {
      console.warn('[vite] prerender plugins not available; skipping prerender step.', error);
    }
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins,
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
