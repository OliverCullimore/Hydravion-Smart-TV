/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'
import p from './package.json'

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: '/', // Set to your base path if you are deploying to a subdirectory (example: /myApp/)
    plugins: [...blitsVitePlugins],
    resolve: {
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      fs: {
        allow: ['..'],
      },
      // Proxy requests to Floatplane API to avoid CORS errors
      proxy: {
        '/api': {
          target: 'https://www.floatplane.com',
          changeOrigin: true,
          headers: {
            'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
            Origin: 'https://www.floatplane.com',
          },
          cookieDomainRewrite: '',
        },
      },
    },
    worker: {
      format: 'es',
    },
  }
})
