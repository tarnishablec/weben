import esbuild from "esbuild"
import { externalDependencies } from "../const.js"
import path from "path"
import { resolvePackageDir, run } from "../utils.js"
import { clean } from "./clean.js"
import chalk from "chalk"

/** @typedef {import("esbuild").BuildOptions} BuildOptions */

/** @type {BuildOptions["format"][]} */
export const buildFormats = ["esm", "iife", "cjs"]

/** @param {string} packageName */
export function generateDts(packageName, entry = `src/index.ts`) {
  const packageDir = resolvePackageDir(packageName)

  console.log(
    chalk.yellow(
      `===== Generating ${packageName} Declaration Files =====`
    )
  )

  run(
    `npx tsc --emitDeclarationOnly -d --outdir ${path.resolve(
      packageDir,
      "dist"
    )} ${path.resolve(packageDir, entry)}`
  )

  console.log(
    chalk.yellowBright(`===== GenDeclaration Files emitted =====`)
  )
}

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

  generateDts(packageName)
}

export default build
