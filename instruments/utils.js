import { AUTHOR, EMAIL, SCOPE, URL } from "./const"
import { commandSync } from "execa"
import { resolve } from "path"

/**
 * Sync
 *
 * @param {string} cmd
 */
export const run = (cmd) => commandSync(cmd, { stdio: "inherit" })

/**
 * @param {{
 *   name: string
 *   scope?: string
 *   author?: string
 *   email?: string
 *   url?: string
 * }} option
 */
export const createPackageJsonObj = ({
  name,
  scope = SCOPE,
  author = AUTHOR,
  email = EMAIL,
  url = URL
}) => {
  return {
    name: `@${scope}/${name}`,
    version: "0.0.1",
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
  }
}

/** @param {string} name Package name */
export const resolvePathByName = (name) => {
  return resolve(String(process.env.PWD), `./packages/${name}`)
}
