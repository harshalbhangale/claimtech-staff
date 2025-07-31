import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // ✅ add this

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // ✅ add this
  ],
});
