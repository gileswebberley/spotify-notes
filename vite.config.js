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
    //let's try to make this a pwa...after a lot of learning and going round in ai generated circles I have discovered that we can get vite-plugin-pwa to generate a service worker for us that will do what we need by using the 'generateSW' strategy and declaring the workbox object rather than trying to write our own sw.js file and using the 'injectManifest' strategy (which is for more fine-grained control over the routing and caching which is beyond my knowledge base at this stage as this is my first experience with PWAs)
    VitePWA({
      //see the comment below about injectManifest...
      // srcDir: 'src',
      // filename: 'sw.js',
      //let's try changing to generateSW which will ignore our sw.js file
      // strategies: 'injectManifest',
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      //this was causing confusion in the build process when using injectManifest, the srcDir etc above worked but because we are using NetworkOnly (rather than NetworkFirst) for the api calls it would not serve the offline.html page when there was no network
      // injectManifest: {
      //   swSrc: path.resolve(__dirname, 'src/sw.js'), // ensure Vite/rollup sees the correct file
      //   swDest: 'sw.js',
      // },
      includeAssets: ['icon_logo.png', 'icons/*', 'offline.html'],
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
        // Serve offline.html if navigation fails for most routes
        navigateFallback: '/index.html',
        // ALLOW only the root path (/) to bypass the fallback logic and go to the network - doesn't work for SPAs
        // navigateFallbackAllowlist: [/^\/$/],

        // If you have specific backend API routes you NEVER want falling back to index.html
        // (which you do), keep your denylist logic configured correctly for those:
        navigateFallbackDenylist: [
          /^https:\/\/accounts\.spotify\.com\/api\/token/,
          /^https:\/\/api\.spotify\.com\/.*/,
        ],
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
      devOptions: { enabled: false }, // doesn't seem to work properly with sw.js and offline etc so having to build and preview instead
    }),
    // Only run eslint in development
    mode === 'development' && eslint(),
  ].filter(Boolean),
  server: { host: HOST, port: PORT, hmr: true },
}));
