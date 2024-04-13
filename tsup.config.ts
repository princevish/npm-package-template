import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  splitting: true,
  clean: true,
});
