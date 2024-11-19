import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['jsx']
        },
        plugins: [
          ['react-refresh/babel', {}, 'refresh'],
        ],
      }
    }),
    viteCommonjs()
  ],
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ],
    alias: {
      'react-native': 'react-native-web',
    }
  },
  define: {
    'process.env': {}
  }
});