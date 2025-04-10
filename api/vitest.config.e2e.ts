import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.e2e-spec.ts"],
    setupFiles: ["./test/vitest.setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
    deps: {
      // Mock passport-http-bearer since we can't install it
      inline: [/passport-http-bearer/],
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src"),
      // Add an alias for the passport-http-bearer package
      "passport-http-bearer": resolve(
        __dirname,
        "./src/auth/strategies/__mocks__/passport-http-bearer.ts"
      ),
    },
  },
});
