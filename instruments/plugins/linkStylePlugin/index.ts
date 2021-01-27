import type { Plugin } from "vite"
// import { renderSync } from "sass"

export const LinkStylePlugin = (): Plugin => {
  return {
    name: "link-style-plugin",
    buildStart() {},
    moduleParsed(info) {},
    async resolveId(source, importer) {
      return source
    }
  }
}
