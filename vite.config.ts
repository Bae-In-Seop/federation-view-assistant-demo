import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  base: '/federation-view-assistant-demo/',
  plugins: [
    vue(),
    react(),
    federation({
      name: 'assistant_demo',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/ReactWrapper.jsx',
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.5.0',
        },
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
      },
    }),
  ],
  server: {
    port: 5004,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
