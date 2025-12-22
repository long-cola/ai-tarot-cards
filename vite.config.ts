import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        sitemap({
          hostname: 'https://ai-tarotcards.vercel.app',
          dynamicRoutes: [
            '/topics',
            // Note: Individual share pages can be submitted separately via sitemap generation
          ],
          exclude: ['/admin', '/admin.html', '/api'],
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date().toISOString().split('T')[0],
          robots: [
            {
              userAgent: '*',
              allow: '/',
              disallow: ['/admin', '/api'],
            }
          ]
        })
      ],
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
