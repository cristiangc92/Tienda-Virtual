import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // Asegura que Vercel sirve la app correctamente
  server: {
    historyApiFallback: true  // Permite que React Router maneje las rutas
  }
});
