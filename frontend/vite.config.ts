/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // We explicitly set the build target to 'esnext' to ensure
  // modern features like 'import.meta' are supported.
  build: {
    target: 'esnext',
  },
  
  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts', // Points to the setup file
  },
});
