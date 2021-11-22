import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/web'),
  plugins: [ vue() ],
  server: {
    port: 6565
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/web')
      }
    ]
  },
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, 'dist'),
    /*
    lib: {
      name: 'tiny-host-common',
      entry: path.resolve(__dirname, 'src/web/index.ts')
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    } // */
  }
});
