/** @type {import("jest/../@jest/types/build/Config").InitialOptions} */
const JestConfig = {
  preset: "ts-jest",
  runner: "@jest-runner/electron",
  testEnvironment: "@jest-runner/electron/environment",
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
  ],
  moduleNameMapper: {
    "^@gallop/gallop":
      "<rootDir>/node_modules/@gallop/gallop/dist/index.umd.js"
  }
}

export default JestConfig
