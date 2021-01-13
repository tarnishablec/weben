/** @type {import("prettier").Options} */
module.exports = {
  semi: false,
  trailingComma: "none",
  tabWidth: 2,
  printWidth: 70,
  arrowParens: "always",
  endOfLine: "crlf",
  overrides: [
    {
      files: "*.js",
      options: {
        endOfLine: "lf",
        parser: "jsdoc-parser"
      }
    }
  ]
}
