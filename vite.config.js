import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { HOST, PORT } from './src/utils/constants';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    // Only run eslint in development
    mode === 'development' && eslint(),
  ].filter(Boolean),
  server: { host: HOST, port: PORT },
}));
