import { REGISTRY } from "../../const.js"
import { run } from "../../utils.js"

export const release = (
  /** @type {string} */ _,
  { registry = REGISTRY }
) => {
  run("yarn run build")
  run("git add .")
  run(`lerna publish --registry ${registry}`)
  run("yarn run clean")
}

export default release
