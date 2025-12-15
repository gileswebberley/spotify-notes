import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//@ts-ignore
import eslint from 'vite-plugin-eslint';
import { HOST, PORT } from './src/utils/constants';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    //let's try to make this a pwa...
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*', 'offline.html'],
      manifest: {
        name: 'Snotify App',
        short_name: 'Snotify',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1DB954',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/offline.html',
        runtimeCaching: [
          // Images and static media: CacheFirst
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Spotify API: avoid caching Authorization responses — use NetworkFirst or NetworkOnly
          {
            urlPattern: /^https:\/\/api\.spotify\.com\/.*/,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'spotify-api',
              networkTimeoutSeconds: 10,
              // prefer not to cache responses that require auth
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
      devOptions: { enabled: mode !== 'production' }, // optional: allow testing SW in dev
    }),
    // Only run eslint in development
    mode === 'development' && eslint(),
  ].filter(Boolean),
  server: { host: HOST, port: PORT },
}));
