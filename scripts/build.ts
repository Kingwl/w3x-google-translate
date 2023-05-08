import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  platform: "node",
  format: "esm",
  bundle: true,
  sourcemap: true,
  external: ["axios"],
});
