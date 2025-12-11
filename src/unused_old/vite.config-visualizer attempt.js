import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import visualizer from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';
import { HOST, PORT } from '../utils/constants';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      eslint(),
      splitVendorChunkPlugin(),
      ...(isBuild ? [visualizer({ filename: './build-stats.html' })] : []),
    ],
    server: { host: HOST, port: PORT },
  };
});
