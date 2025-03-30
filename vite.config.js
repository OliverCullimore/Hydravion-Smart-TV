/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import p from './package.json'

const platform = (process.env.VITE_PLATFORM || 'webos') == 'webos' ? 'webos' : 'tizen'

// TODO: Fix any legacy issues:
// https://github.com/lightning-js/blits-example-app/compare/master...feature/legacy-browser-support
// https://github.com/Angel-Studios/angel-smart-tv-blits/commit/42809879a24bb4775bd17c48fdd9f960187651ef

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: '', // Set base path to be relative
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
      // Proxy requests to Floatplane to avoid CORS errors
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
