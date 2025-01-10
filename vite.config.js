import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (process.env.NODE_ENV === "development") {
    return {
      plugins: [react()],
    };
  } else {
    return {
      base: "/",
      plugins: [react()],
      preview: {
        port: 8081,
        strictPort: true,
      },
      server: {
        port: 8081,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:8081",
        proxy: {
          "/api": {
            target: "https://be-bukom.sekolahbinekas.com", // Backend URL
            changeOrigin: true, // This ensures the origin is passed correctly
            secure: true, // If your backend uses HTTPS
            rewrite: (path) => path.replace(/^\/api/, ""), // Optional path rewrite
          },
        },
      },
    };
  }
});
