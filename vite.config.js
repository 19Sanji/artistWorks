import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Сайт публикуется на https://19sanji.github.io/artistWorks/ — отсюда base.
// При переименовании репозитория поменяйте base (и адреса в og-тегах index.html).
export default defineConfig({
  base: '/artistWorks/',
  plugins: [react()],
});
