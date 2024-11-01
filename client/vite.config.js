import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === "production" ? "/static/frontend/" : "/",
    build: {
      outDir: "../server/static/frontend", // Django static folder
      emptyOutDir: true, // Clear out directory before build
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          assetFileNames: "assets/[name].[hash].[ext]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
        },
      },
    },
    resolve: {
      alias: {
        assets: "/src/assets",
        components: "/src/components",
        examples: "/src/examples",
        layouts: "/src/layouts",
        context: "/src/context",
        utils: "/src/utils",
        pages: "/src/pages",
      },
    },
  };
});
