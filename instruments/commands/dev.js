import { createServer } from "vite"
// import { startServer } from "snowpack"
import { LinkStylePlugin } from "../plugins/linkStylePlugin/index.js"
import { resolvePackageDir } from "../utils.js"
import path from "path"

/**
 * @param {string} packageName
 * @param {{ server: "vite" | "snow" }} [serverType] Default is `"vite"`
 */
export const dev = (packageName, { server = "vite" }) => {
  eval(`${server}Dev("${packageName}")`)
}

/** @param {string} packageName */
export const viteDev = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  createServer({
    root: path.resolve(packageDir, "src"),
    server: { hmr: true, port: 8888 },
    esbuild: {
      format: "esm",
      treeShaking: true
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    assetsInclude: [".scss"],
    plugins: [LinkStylePlugin()]
  }).then((server) => {
    server.listen()
  })
}

// snowpack is currently unusable

// /** @param {string} packageName */
// export const snowDev = (packageName) => {
//   const packageDir = resolvePackageDir(packageName)
//   startServer({
//     lockfile: null,
//     config: {
//       root: path.resolve(packageDir, "src"),
//       exclude: [],
//       mount: {},
//       alias: {},
//       plugins: [],
//       devOptions: {
//         secure: false,
//         hostname: "localhost",
//         port: 8080,
//         open: "edge",
//         output: "dashboard",
//         hmrDelay: 0,
//         hmrPort: 12345,
//         hmrErrorOverlay: false
//       }
//     }
//   })
// }

export default dev
