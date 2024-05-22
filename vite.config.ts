import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  plugins: [
    react(),
    inject({
      include: ['node_modules/simple-peer/**'],
      modules: {
        process: 'process/browser',
      },
    }),
  ],
  base: '/ChatApp',
  server: {
    port: 3000,
  },
});
