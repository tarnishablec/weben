import fs from "fs-extra"
import path from "path"
import {
  boot,
  createPackageJsonObj,
  resolvePackageDir,
  resolvePackageJsonPath
} from "../../utils.js"

const cachedPkgJsonFields = [
  "devDependencies",
  "peerDependencies",
  "dependencies",
  "private",
  "buildOptions",
  "gitHead",
  "version"
]

/** @param {string} packageName */
export const init = (packageName, { reset = false }) => {
  if (reset) {
    initPackageJson(packageName, { reset })
    initTest(packageName)
    initIndexTs(packageName, { reset })
  }
  boot()
}

/** @param {string} packageName */
export const initPackageJson = (
  packageName,
  { reset = false } = {}
) => {
  const packageJsonPath = resolvePackageJsonPath(packageName)
  const packageJsonObj = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8")
  )
  const cache = {}
  cachedPkgJsonFields
    .filter((f) => (reset ? !["version"].includes(f) : true))
    .forEach((field) =>
      Reflect.set(cache, field, Reflect.get(packageJsonObj, field))
    )
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      createPackageJsonObj({ name: packageName }, cache),
      null,
      2
    )
  )
}

/** @param {string} packageName */
export const initIndexTs = (packageName, { reset = false }) => {
  const packageDir = resolvePackageDir(packageName)
  const indexPath = path.resolve(packageDir, "src/index.ts")
  if (!fs.existsSync(indexPath) || reset) {
    fs.ensureFileSync(indexPath)
    fs.writeFileSync(
      indexPath,
      `export const hello = '${packageName}'`
    )
    fs.removeSync(path.resolve(packageDir, "lib"))
  }
}

/** @param {string} packageName */
export const initTest = (packageName) => {
  const packageDir = resolvePackageDir(packageName)
  const testMainPath = path.resolve(
    packageDir,
    `__tests__/${packageName}.test.ts`
  )
  fs.removeSync(
    path.resolve(packageDir, `__tests__/${packageName}.test.js`)
  )
  if (!fs.existsSync(testMainPath)) {
    fs.ensureFileSync(testMainPath)
    fs.writeFileSync(
      testMainPath,
      `'use strict'

// import {} from '../src'

describe('test', () => {
  test('adds 1 + 2 to equal 3', () => {
    // expect(func()).toBe(res)
  })
})`
    )
  }
}

export default init
