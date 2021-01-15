import fs from "fs-extra"
import path from "path"
import minimist from "minimist"
import { cachedPkgJsonFields } from "../const.js"
import {
  boot,
  createPackageJsonObj,
  resolvePackageDir
} from "../utils.js"

/** @param {string} packageName */
export const init = (
  packageName,
  isInit = !!minimist(process.argv.slice(2)).init
) => {
  if (isInit) {
    const packageDir = resolvePackageDir(packageName)
    initPackageJson(packageDir, packageName, isInit)
    initTest(packageDir, packageName)
    initIndexTs(packageDir, packageName)
  }
  boot()
}

/**
 * @param {string} packageDir
 * @param {string} packageName
 * @param {boolean} [isInit] Default is `false`
 */
export const initPackageJson = (
  packageDir,
  packageName,
  isInit = false
) => {
  const packageJsonPath = path.resolve(packageDir, `package.json`)
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonObj = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    )
    const cache = {}
    cachedPkgJsonFields
      .filter((f) => (isInit ? !["version"].includes(f) : true))
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
  } else {
    throw new Error(
      `package [${packageName}] package.json does not exist`
    )
  }
}

/**
 * @param {string} packageDir
 * @param {string} packageName
 */
export const initIndexTs = (packageDir, packageName) => {
  const indexPath = path.resolve(packageDir, "src/index.ts")
  if (!fs.existsSync(indexPath)) {
    fs.ensureFileSync(indexPath)
    fs.writeFileSync(
      indexPath,
      `export const hello = '${packageName}'`
    )
  }
}

/**
 * @param {string} packageDir
 * @param {string} packageName
 */
export const initTest = (packageDir, packageName) => {
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
