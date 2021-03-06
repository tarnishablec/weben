import { run } from "../../utils.js"

export const release = () => {
  run("yarn run build")
  run("git add .")
  run("lerna publish")
  run("yarn run clean")
}

export default release
