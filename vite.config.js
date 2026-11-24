import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Ship the mock JSON as a string that is parsed once, which is faster than a large object literal.
  json: { stringify: true },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
});
