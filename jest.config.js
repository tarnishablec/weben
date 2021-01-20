import tsJest from "ts-jest/utils/index.js"
import { require } from "./instruments/utils.js"

/** @type {import("jest/../@jest/types/build/Config").InitialOptions} */
const JestConfig = {
  ...tsJest.createJestPreset({ allowJs: true }),
  ...require("jest-puppeteer/jest-preset.json"),
  testMatch: [
    "<rootDir>/packages/**/__tests__/**/*.+(test|spec).[jt]s?(x)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/packages/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!<rootDir>/packages/*/dist/**",
    "!<rootDir>/packages/*/index.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
}

export default JestConfig
