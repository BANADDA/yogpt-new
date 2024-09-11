import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Listen on all IPv4 addresses. Set to 'localhost' to restrict to local machine.
    strictPort: true, // Vite will fail to start if the port is already in use instead of automatically trying the next available port.
    port: 8000,       // Specify the server port. You mentioned changing to 8000, but your code snippet says 3000.
  },
})