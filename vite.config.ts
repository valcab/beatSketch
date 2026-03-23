import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const copyExtensionAssets = () => ({
  name: "copy-extension-assets",
  closeBundle() {
    const root = __dirname;
    const dist = path.resolve(root, "dist");
    const manifestSource = path.resolve(root, "manifest.json");
    const manifestDest = path.resolve(dist, "manifest.json");
    const drumsSource = path.resolve(root, "src/assets/drums");
    const drumsDest = path.resolve(dist, "assets/drums");
    const iconsSource = path.resolve(root, "icons");
    const iconsDest = path.resolve(dist, "icons");

    if (fs.existsSync(manifestSource)) {
      fs.copyFileSync(manifestSource, manifestDest);
    }

    if (fs.existsSync(drumsSource)) {
      fs.mkdirSync(path.dirname(drumsDest), { recursive: true });
      fs.cpSync(drumsSource, drumsDest, { recursive: true });
    }

    if (fs.existsSync(iconsSource)) {
      fs.cpSync(iconsSource, iconsDest, { recursive: true });
    }
  }
});

export default defineConfig({
  plugins: [react(), copyExtensionAssets()],
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        background: path.resolve(__dirname, "src/background/index.ts")
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "background" ? "background.js" : "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {
          vendor: ["react", "react-dom", "zustand"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-slider",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip"
          ]
        }
      }
    }
  }
});
