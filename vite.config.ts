import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    target: 'node22',
    minify: false,

    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
    },

    rollupOptions: {
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
  },
  ssr: {
    noExternal: [
      'vue-metamorph',
    ],
  },
})
