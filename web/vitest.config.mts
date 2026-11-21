import { createRequire } from "module";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// next-sanity depends on its own copy of @sanity/preview-url-secret. Point every
// import of it at that copy so vi.mock("@sanity/preview-url-secret") in route
// tests replaces the module next-sanity actually calls (no network in tests).
const nextSanityRequire = createRequire(createRequire(import.meta.url).resolve("next-sanity/package.json"));
const previewUrlSecretEntry = nextSanityRequire.resolve("@sanity/preview-url-secret");

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    globals: true,
    css: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", "e2e/**"],
    server: {
      deps: {
        // Process next-sanity through Vite so its imports of next/* and
        // @sanity/preview-url-secret resolve and can be mocked in route tests.
        inline: ["next-sanity"],
      },
    },
  },
  resolve: {
    alias: [
      { find: /^@sanity\/preview-url-secret$/, replacement: previewUrlSecretEntry },
      { find: "@", replacement: resolve(__dirname, "./") },
    ],
  },
});
