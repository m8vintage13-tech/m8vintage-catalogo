import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // host:true expone el server en la red local (ej. 192.168.x.x:5173) para
  // poder abrirlo desde el celular real y probar el catálogo ahí.
  server: { host: true },
});
