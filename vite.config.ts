import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { PluginItem } from '@babel/core';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['jsx']
        },
        plugins: [
          mode === 'development' && 'react-refresh/babel'
        ].filter(Boolean) as PluginItem[]
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
}));