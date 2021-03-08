import execa from "execa"
import path from "path"
import fs from "fs-extra"
import { createRequire } from "module"
// import chalk from "chalk"

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
  { name, scope, author, email, url },
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

export const resolveRepoRootDir = () => process.cwd()

/** @param {string} packageName */
export const resolvePackageDir = (packageName) => {
  return path.resolve(
    resolveRepoRootDir(),
    `./packages/${packageName}`
  )
}

/** @param {string} packageName */
export const resolvePackageJsonPath = (packageName) => {
  const packageJsonPath = path.resolve(
    resolvePackageDir(packageName),
    "package.json"
  )
  if (fs.existsSync(packageJsonPath)) {
    return path.resolve(
      resolvePackageDir(packageName),
      "package.json"
    )
  } else {
    throw new Error(
      `package [${packageName}] package.json does not exist`
    )
  }
}

/** @param {string} packageName */
export const resolvePackageJsonObj = (packageName) => {
  return JSON.parse(
    fs.readFileSync(resolvePackageJsonPath(packageName), "utf-8")
  )
}

export const boot = () => run("lerna bootstrap")

/** @param {number} timeout */
export const sleep = async (timeout) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(void 0)
    }, timeout)
  })
}

/** @param {string} message */
export const log = (message) => {
  console.log(message)
}

export const require = createRequire(import.meta.url)
