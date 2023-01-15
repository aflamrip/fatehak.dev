import { defineConfig } from 'astro/config';
import { paramCase } from 'change-case';
import AstroCompress from 'astro-compress';
import AstroTailwindPlugin from '@astrojs/tailwind';
import getTargetBrowsers from 'browserslist-to-esbuild';
import { APP_CONFIG, COMPRESSION_CONFIG } from './appConfig';

const isProd = process.env.BUILD === 'production';
export default defineConfig({
  site: APP_CONFIG.PROD_BASE_URL,
  integrations: [AstroTailwindPlugin({ config: { applyBaseStyles: false } }), isProd && AstroCompress(COMPRESSION_CONFIG)],
  server: { port: 3000, host: true },
  vite: {
    build: {
      target: getTargetBrowsers(),
      minify: isProd ? 'esbuild' : false,
      sourcemap: isProd ? 'hidden' : true,
      rollupOptions: {
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: file => `chunks/${paramCase(file.name)}.[hash].js`,
          assetFileNames: file => `assets/${paramCase(file.name.split('.')[0])}.[hash].[ext]`,
        },
      },
    },
  },
});
