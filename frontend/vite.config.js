import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'pages',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        auth: resolve(__dirname, 'pages/auth.html'),
        chat: resolve(__dirname, 'pages/chat.html'),
        library: resolve(__dirname, 'pages/library.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        vault: resolve(__dirname, 'pages/vault.html'),
        404: resolve(__dirname, 'pages/404.html'),
        'privacy-policy': resolve(__dirname, 'pages/privacy-policy.html'),
        'request-book': resolve(__dirname, 'pages/request-book.html'),
        'terms-and-conditions': resolve(__dirname, 'pages/terms-and-conditions.html')
      }
    }
  }
});
