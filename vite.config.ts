import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import inject from '@rollup/plugin-inject';
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    inject({
      include: ['node_modules/simple-peer/**'],
      modules: {
        process: 'process/browser',
      },
    }),
    , VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.png"],
      manifest: {
        name: "ChatApp",
        short_name: "ChatApp",
        start_url: "/ChatApp/",
        scope: "/ChatApp/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2",
        description: "browse ChatApp",
        screenshots: [
          {
            src: "screenshot-mobile.png",
            sizes: "960x540",
            type: "image/png",
            form_factor: "narrow",
            label: "Mobile overview",
          },
          {
            src: "screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Desktop layout",
          },
        ],
        icons: [
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  base: '/ChatApp',
  server: {
    port: 3000,
  },

});
