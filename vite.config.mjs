import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/CodeCommentTranslator/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
  },
});
