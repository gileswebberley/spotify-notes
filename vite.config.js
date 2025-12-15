import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//@ts-ignore
import eslint from 'vite-plugin-eslint';
import { HOST, PORT } from './src/utils/constants';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => ({
  //trying to fix the problem with sw.js not being found
  build: {
    outDir: 'dist', // Ensures all build outputs go into the 'dist' folder
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    //let's try to make this a pwa...
    VitePWA({
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      // injectManifest: {
      //   swSrc: path.resolve(__dirname, 'src/sw.js'), // ensure Vite/rollup sees the correct file
      //   swDest: 'sw.js',
      // },
      includeAssets: [
        'icon_logo.png',
        'icons/*',
        'offline.html',
        'manifest.webmanifest',
      ],
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
        navigateFallback: '/index.html',
        runtimeCaching: [
          // token endpoint: never cache
          {
            urlPattern: /^https:\/\/accounts\.spotify\.com\/api\/token/,
            handler: 'NetworkOnly',
          },
          // safe caching for images/static assets
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // no cache for API calls as react-query handles the caching
          {
            urlPattern: /^https:\/\/api\.spotify\.com\/.*/,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: { enabled: false }, // optional: allow testing SW in dev
    }),
    // Only run eslint in development
    mode === 'development' && eslint(),
  ].filter(Boolean),
  server: { host: HOST, port: PORT },
}));
