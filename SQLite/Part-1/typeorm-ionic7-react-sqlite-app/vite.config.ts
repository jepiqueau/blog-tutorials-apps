import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import swc from 'unplugin-swc'; // Support using decorators without explicitly set ``types`` in ``TypeORM``
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    swc.vite({
      exclude: [], //Default would exclude all file from ``node_modules``
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          //Suggested by ``capacitor-sqlite``
          keep_classnames: true,
          keep_fnames: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
