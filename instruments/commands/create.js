import { init } from "./init.js"
import { resolvePackageDir, run } from "../utils.js"
import minimist from "minimist"
import { SCOPE } from "../const.js"
import fs from "fs-extra"
import path from "path"

export const create = () => {
  const { name: packageName } = minimist(process.argv.slice(2))
  run(`npx lerna create @${SCOPE}/${packageName} --yes`, {})
  init(packageName, true)
  const packageDir = resolvePackageDir(packageName)
  fs.removeSync(path.resolve(packageDir, "lib"))
}

export default create
