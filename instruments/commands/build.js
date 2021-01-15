import esbuild from "esbuild"
import { externalDependencies } from "../const.js"
import path from "path"
import { resolvePackageDir } from "../utils.js"
import { clean } from "./clean.js"
import chalk from "chalk"

/** @typedef {import("esbuild").BuildOptions} BuildOptions */

/** @type {BuildOptions["format"][]} */
export const buildFormats = ["esm", "iife", "cjs"]

/**
 * @param {string} packageName
 * @param {{ ignoreExternal?: boolean }} options
 */
export function build(packageName, { ignoreExternal = false }) {
  clean(packageName)
  const packageDir = resolvePackageDir(packageName)
  buildFormats.forEach((format) => {
    const outfile = path.resolve(
      packageDir,
      `dist/index.${format}.js`
    )

    console.log(
      chalk.cyan(
        `===== Building ${packageName} == format: ${format} =====`
      )
    )
    esbuild.buildSync({
      entryPoints: [path.resolve(packageDir, "src/index.ts")],
      outfile,
      loader: { ".ts": "ts" },
      platform: "browser",
      format,
      minify: true,
      external: ignoreExternal ? [] : externalDependencies,
      bundle: true
    })

    console.log(
      chalk.greenBright(
        `===== Building finished >>>>> ${outfile} =====`
      )
    )
  })
}

export default build
