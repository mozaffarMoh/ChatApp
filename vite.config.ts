import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';


export default defineConfig({
  plugins: [react()],
  base: '/ChatApp',
  server: {
    port: 3000
  },
  define: { global: {} }
});
