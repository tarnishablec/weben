import esbuild from "esbuild"
import { externalDependencies } from "../../const.js"
import path from "path"
import {
  resolvePackageDir,
  resolvePackageJsonObj,
  resolveRepoRootDir
} from "../../utils.js"
import { clean } from "./clean.js"
import chalk from "chalk"
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor"
import ts from "typescript"
import fs from "fs-extra"

/** @typedef {import("esbuild").BuildOptions} BuildOptions */

/**
 * @type {{
 *   format: BuildOptions["format"]
 *   minify?: boolean
 *   outfileName: string
 * }[]}
 */
export const buildFormats = [
  { format: "esm", minify: true, outfileName: "index.esm.min.js" },
  { format: "esm", outfileName: "index.esm.js" },
  { format: "cjs", minify: true, outfileName: "index.cjs.js" },
  { format: "iife", minify: true, outfileName: "index.iife.js" }
]

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
        compiler: {
          tsconfigFilePath: path.resolve(
            resolveRepoRootDir(),
            "tsconfig.json"
          )
        },
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
}

/** @param {string} packageName */
export function build(packageName, { ignoreExternal = false } = {}) {
  clean(packageName)
  const packageDir = resolvePackageDir(packageName)

  const getPeers = () => {
    const peerObj = Reflect.get(
      resolvePackageJsonObj(packageName),
      "peerDependencies"
    )
    return peerObj ? Object.keys(peerObj) : []
  }

  const peerDependencies = getPeers()

  buildFormats.forEach(({ format, outfileName, minify }) => {
    const outfile = path.resolve(packageDir, `dist/${outfileName}`)

    console.log(
      chalk.cyan(
        `===== Building ${packageName} == format: ${format} == minify: ${!!minify} =====`
      )
    )
    esbuild.buildSync({
      entryPoints: [path.resolve(packageDir, "src/index.ts")],
      outfile,
      loader: { ".ts": "ts" },
      format,
      minify,
      external: [
        ...peerDependencies,
        ...(ignoreExternal ? [] : externalDependencies)
      ],
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
