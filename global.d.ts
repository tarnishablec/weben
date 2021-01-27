declare module "*.scss" {}
declare module "*.css" {}

declare module "*.scss?link" {
  const content: string
  export default content
}

declare module "*.css?link" {
  const content: string
  export default content
}
