import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://fastcard-1-o23z.onrender.com/api'),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AIzaSyB0pZuZ25X4csUzoXyDK4SrCDtiAjjsngI')
  }
});
