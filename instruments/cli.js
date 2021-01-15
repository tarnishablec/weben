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

  const targets = resolveArgTargets(args)

  /**
   * @param {(
   *   packageName?: string,
   *   options?: Record<string, unknown>
   * ) => void} fn
   */
  const batchRun = (fn) =>
    !targets.length && args.emptyIsRoot
      ? fn()
      : targets.forEach((target) => fn(target, args))

  const mod = await import(`./commands/${command}.js`)
  return batchRun(mod.default ?? mod[command])
}

/** @param {Record<string, unknown>} args */
export const resolveArgTargets = ({
  emptyIsRoot,
  ignoreBlackList
} = {}) => {
  let { _, blacklist } = minimist(process.argv.slice(2))
  blacklist = String(blacklist).split(",")
  const targets =
    _.length === 0 && !emptyIsRoot
      ? fs
          .readdirSync(path.resolve(resolveRepoRootDir(), "packages"))
          .filter((name) =>
            ignoreBlackList
              ? true
              : ![...packageBlackList, ...blacklist].includes(name)
          )
      : _
  return targets.filter(Boolean)
}

runCommand()
