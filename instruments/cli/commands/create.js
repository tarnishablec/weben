import { init } from "./init.js"
import { run } from "../../utils.js"
import { SCOPE } from "../../const.js"

/** @param {string} packageName */
export const create = (packageName, { scope = SCOPE }) => {
  if (!packageName)
    throw new Error(`must provide a name before create package.`)
  run(`npx lerna create @${scope}/${packageName} --yes`, {})
  init(packageName, { reset: true })
}

export default create
