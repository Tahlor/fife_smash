import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@input': path.resolve(__dirname, './src/input'),
      '@physics': path.resolve(__dirname, './src/physics'),
      '@render': path.resolve(__dirname, './src/render'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@audio': path.resolve(__dirname, './src/audio'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
});
