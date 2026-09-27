import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const reactRouterProd = (file) =>
  fileURLToPath(
    new URL(
      `./node_modules/react-router/dist/production/${file}`,
      import.meta.url,
    ),
  );

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias:
      mode === "production"
        ? [
            {
              find: /^react-router$/,
              replacement: reactRouterProd("index.mjs"),
            },
            {
              find: /^react-router\/dom$/,
              replacement: reactRouterProd("dom-export.mjs"),
            },
          ]
        : [],
  },
}));
