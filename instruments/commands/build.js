import esbuild from "esbuild"
import { externalDependencies } from "../const.js"
import path from "path"
import { resolvePackageDir, resolveRepoRootDir } from "../utils.js"
import { clean } from "./clean.js"
import chalk from "chalk"
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor"
import ts from "typescript"
import fs from "fs-extra"

/** @typedef {import("esbuild").BuildOptions} BuildOptions */

/** @type {BuildOptions["format"][]} */
export const buildFormats = ["esm", "iife", "cjs"]

/** @param {string} packageName */
export function generateDts(
  packageName,
  { entry = `src/index.ts` } = {}
) {
  const packageDir = resolvePackageDir(packageName)

  console.log(
    chalk.yellow(
      `===== Generating ${packageName} Declaration Files =====`
    )
  )

  const tempDir = path.resolve(packageDir, "dist/.temp")

  ts.createProgram({
    rootNames: [path.resolve(packageDir, entry)],
    options: {
      declaration: true,
      emitDeclarationOnly: true,
      outDir: tempDir
    }
  }).emit()

  Extractor.invoke(
    ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: path.resolve(tempDir, "index.d.ts"),
        dtsRollup: {
          enabled: true,
          untrimmedFilePath: path.resolve(
            packageDir,
            "dist/index.d.ts"
          ),
          omitTrimmingComments: true
        },
        projectFolder: packageDir,
        compiler: { overrideTsconfig: {} },
        bundledPackages: []
      },
      configObjectFullPath: path.resolve(
        resolveRepoRootDir(),
        "tsconfig.json"
      ),
      packageJsonFullPath: path.resolve(packageDir, "package.json")
    }),
    { showVerboseMessages: true, localBuild: true }
  )

  fs.removeSync(tempDir)

  // run(
  //   `npx ts-bundle-generator -o ${path.resolve(
  //     packageDir,
  //     "dist/index.d.ts"
  //   )} ${path.resolve(packageDir, entry)}`
  // )

  console.log(
    chalk.yellowBright(`===== GenDeclaration Files emitted =====`)
  )
}

/** @param {string} packageName */
export function build(packageName, { ignoreExternal = false } = {}) {
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
