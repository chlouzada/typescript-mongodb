import { defineConfig } from "tsup"

const isDev =
  process.env.npm_lifecycle_event === "dev" ||
  process.env.npm_lifecycle_event === "test"

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: !isDev,
  metafile: !isDev,
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  onSuccess: isDev ? "node dist/index.js" : undefined,
})
