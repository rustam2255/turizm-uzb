import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const resolvePath = (dir: string) => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
      '@components': resolvePath('src/components'),
      '@pages': resolvePath('src/pages'),
      '@assets': resolvePath('src/assets'),
    },
  },
});
