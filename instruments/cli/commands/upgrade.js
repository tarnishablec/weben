import ncu from "npm-check-updates"
import { boot, resolvePackageDir } from "../../utils.js"
import chalk from "chalk"
import path from "path"

/** @param {string} [packageName] */
export const upgrade = (packageName) => {
  ncu
    .run({
      packageManager: "yarn",
      interactive: true,
      upgrade: true,
      timeout: 600000,
      packageFile: packageName
        ? path.resolve(resolvePackageDir(packageName), "package.json")
        : undefined
    })
    .then((res) => {
      console.log(
        `[${
          packageName ?? "Root"
        }] upgraded dependencies: ${chalk.cyan(JSON.stringify(res))}`
      )
      Object.keys(res).length && boot()
    })
}

export default upgrade
