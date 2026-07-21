import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Exclude Next build output + node_modules from the test sweep.
    exclude: ["node_modules", ".next"],
  },
  resolve: {
    // Mirror the tsconfig "@/*" -> src alias so imports resolve in tests.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
