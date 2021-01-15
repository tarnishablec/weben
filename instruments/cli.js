import minimist from "minimist"
import path from "path"
import fs from "fs-extra"
import { packageBlackList } from "./const.js"
import { resolveRepoRootDir } from "./utils.js"

/** @param {string} [cmd] */
export const runCommand = async (cmd) => {
  const args = minimist(process.argv.slice(2))
  const command = cmd ?? args.command
  if (command === undefined) throw new Error(`Command not found!`)
  const targets = resolveArgTargets()

  /** @param {(packageName?: string) => void} fn */
  const batchRun = (fn) =>
    targets.length ? targets.forEach(fn) : fn()

  const mod = await import(`./commands/${command}.js`)
  return batchRun(mod.default ?? mod[command])
}

export const resolveArgTargets = (emptyIsAll = true) => {
  const { _ } = minimist(process.argv.slice(2))
  const targets =
    _.length === 0 && emptyIsAll
      ? fs
          .readdirSync(path.resolve(resolveRepoRootDir(), "packages"))
          .filter((name) => !packageBlackList.includes(name))
      : _
  return targets.filter(Boolean)
}

runCommand()
