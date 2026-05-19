// frontend/vite.config.js

import {
  defineConfig
} from 'vite';

import react
  from '@vitejs/plugin-react';

// =============================================
// VITE CONFIG
// =============================================

export default defineConfig({

  plugins: [
    react()
  ],

  server: {

    port: 5173,

    open: true
  }
});