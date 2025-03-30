/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import p from './package.json'

const platform = (process.env.PLATFORM || 'webos') == 'webos' ? 'webos' : 'tizen'

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: '/', // Set to your base path if you are deploying to a subdirectory (example: /myApp/)
    plugins: [
      ...blitsVitePlugins,
      viteStaticCopy({
        targets: [
          {
            src: 'platform/' + platform + '/*',
            dest: '../',
          },
        ],
      }),
    ],
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
        '/profile_images': {
          target: 'https://pbs.floatplane.com',
          changeOrigin: true,
          headers: {
            'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
            Origin: 'https://www.floatplane.com',
          },
          cookieDomainRewrite: '',
        },
        '/creator_icons': {
          target: 'https://pbs.floatplane.com',
          changeOrigin: true,
          headers: {
            'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
            Origin: 'https://www.floatplane.com',
          },
          cookieDomainRewrite: '',
        },
        '/cover_images': {
          target: 'https://pbs.floatplane.com',
          changeOrigin: true,
          headers: {
            'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
            Origin: 'https://www.floatplane.com',
          },
          cookieDomainRewrite: '',
        },
        '/blogPost_thumbnails': {
          target: 'https://pbs.floatplane.com',
          changeOrigin: true,
          headers: {
            'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
            Origin: 'https://www.floatplane.com',
          },
          cookieDomainRewrite: '',
        },
      },
    },
    build: {
      outDir: 'dist/' + platform + '/app',
    },
    worker: {
      format: 'es',
    },
  }
})
