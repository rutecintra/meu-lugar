import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'openstreetmap-tiles',
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
    //           },
    //         },
    //       },
    //     ],
    //   },
    //   manifest: {
    //     name: 'Meu Lugar - Geografia para Crianças',
    //     short_name: 'Meu Lugar',
    //     description: 'Aprenda Geografia de forma lúdica explorando seu lugar favorito',
    //     theme_color: '#0ea5e9',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: '/icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
