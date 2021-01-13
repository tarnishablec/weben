const esbuild = require("esbuild")

/** @typedef {esbuild.BuildOptions} BuildOptions */

/**
 * @param {{
 *   entryPoints: BuildOptions["entryPoints"]
 *   platform: BuildOptions["platform"]
 *   format: BuildOptions["format"]
 * }} options
 */
export const build = ({ entryPoints, platform, format }) =>
  esbuild.buildSync({
    entryPoints,
    outdir: "dist",
    outfile: "index.esm.js",
    loader: { ".ts": "ts" },
    platform,
    format
  })
