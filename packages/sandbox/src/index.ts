import("@gallop/gallop").then((gallop) => {
  gallop.component("test-a", () => {
    return gallop.html`<div>gallop</div>`
  })
})

export const a = 1
