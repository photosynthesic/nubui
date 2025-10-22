import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/icon/index.ts",
    "src/icon/constants.ts",
    "src/icon/icon-mask-generator.ts",
    "src/button/index.ts",
  ],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "lib",
  outExtension({ format }) {
    return format === "cjs" ? { js: ".cjs" } : { js: ".mjs" };
  },
  clean: true,
  noTreeshake: true,
  splitting: false,
});
