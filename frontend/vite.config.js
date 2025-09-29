import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [react()],
  closeBundle() {
    try {
      copyFileSync(resolve(__dirname, "_redirects"), resolve(__dirname, "dist/_redirects"));
    } catch (e) {
      // Ignore if file doesn't exist
    }
  },
});
