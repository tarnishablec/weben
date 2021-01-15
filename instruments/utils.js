import { AUTHOR, EMAIL, SCOPE, URL } from "./const.js"
import execa from "execa"
import path from "path"

/**
 * @param {string} cmd
 * @param {import("execa").SyncOptions} [options]
 */
export const run = (cmd, options = {}) =>
  execa.commandSync(cmd, { stdio: "inherit", ...options })

/**
 * @param {{
 *   name: string
 *   scope?: string
 *   author?: string
 *   email?: string
 *   url?: string
 * }} option
 * @param {object} [pkgJsonCacheObj] Default is `{}`
 */
export const createPackageJsonObj = (
  { name, scope = SCOPE, author = AUTHOR, email = EMAIL, url = URL },
  pkgJsonCacheObj = {}
) =>
  Object.assign(
    {
      name: `@${scope}/${name}`,
      version: "0.0.0",
      description: `${scope} ${name}`,
      main: "src/index.ts",
      module: "dist/index.esm.js",
      types: "dist/index.d.ts",
      sideEffect: false,
      repository: {
        type: "git",
        url
      },
      keywords: [scope, name],
      author: `${author} <${email}>`,
      homepage: "",
      license: "MIT",
      directories: {
        src: "src",
        test: "__tests__"
      },
      files: ["src", "dist"],
      publishConfig: {
        access: "public"
      }
    },
    pkgJsonCacheObj
  )

export const resolveRepoRootDir = () => String(process.cwd())

/** @param {string} packageName */
export const resolvePackageDir = (packageName) => {
  return path.resolve(
    resolveRepoRootDir(),
    `./packages/${packageName}`
  )
}

export const boot = () => run("lerna bootstrap")
