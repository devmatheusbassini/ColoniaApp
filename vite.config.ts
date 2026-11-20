import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpeg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Colônia de Férias da Tia Cí',
        short_name: 'Tia Cí',
        description: 'Gestão de hospedagem, clientes, agenda, vacinas e termos para pets.',
        theme_color: '#d9578f',
        background_color: '#fffaf7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2}'],
        navigateFallback: '/index.html'
      }
    })
  ]
})
