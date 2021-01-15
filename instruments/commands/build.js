import esbuild from "esbuild"
import { externalDependencies } from "../const.js"
import path from "path"
import { resolvePackageDir } from "../utils.js"
import { clean } from "./clean.js"

/** @typedef {import("esbuild").BuildOptions} BuildOptions */

/**
 * @param {string} packageDir
 * @param {BuildOptions} buildOptions
 */
export const buildPackage = (
  packageDir,
  { entryPoints, platform = "browser", format = "esm" }
) =>
  esbuild.buildSync({
    entryPoints,
    outfile: path.resolve(packageDir, `dist/index.${format}.js`),
    loader: { ".ts": "ts" },
    platform,
    format,
    external: externalDependencies,
    bundle: true
  })

/** @type {BuildOptions["format"][]} */
export const buildFormats = ["esm", "iife"]

/** @param {string} packageName */
export function build(packageName) {
  clean(packageName)
  const packageDir = resolvePackageDir(packageName)
  buildFormats.forEach((format) =>
    buildPackage(packageDir, {
      entryPoints: [path.resolve(packageDir, "src/index.ts")],
      format
    })
  )
}

export default build
