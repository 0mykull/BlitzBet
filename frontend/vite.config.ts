import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill `Buffer` and `process` environments (required for @solana/web3.js and @coral-xyz/anchor)
      include: ["buffer", "process", "util", "stream", "events"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
});
