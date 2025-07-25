import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: ['e1123bc3deb8.ngrok-free.app'], // 👈 host từ ngrok bạn đang dùng
  },
});
