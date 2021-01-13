import { Command } from "commander"
import { run } from "./utils"

const program = new Command()

program.command("new <name>").action(() => {
  run(`lerna create`)
})
