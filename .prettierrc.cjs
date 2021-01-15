/** @type {import("prettier").Options} */
module.exports = {
  semi: false,
  trailingComma: "none",
  tabWidth: 2,
  printWidth: 70,
  arrowParens: "always",
  overrides: [
    {
      files: "*.js",
      options: {
        parser: "jsdoc-parser"
      }
    }
  ]
}
