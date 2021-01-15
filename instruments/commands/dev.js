import { createServer } from "vite"
import { resolvePackageDir } from "../utils.js"
import path from "path"

/** @param {string} packageName */
export const dev = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  createServer({
    root: path.resolve(packageDir, "src"),
    server: { hmr: true },
    esbuild: {
      format: "esm",
      treeShaking: true
    },
    build: {
      base: "/"
    }
  }).then((server) => {
    server.listen()
  })
}

export default dev
