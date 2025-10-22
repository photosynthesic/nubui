import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/icon/index.ts", "src/button/index.ts"],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "lib",
  outExtension({ format }) {
    return format === "cjs" ? { js: ".cjs" } : { js: ".mjs" };
  },
  clean: true,
});
