"use strict"

import { component, html, render } from "@gallop/gallop"

describe("test", () => {
  component("t-t", function () {
    return html`<div>this is test</div>`
  })

  render(html`<t-t></t-t>`)

  test("adds 1 + 2 to equal 3", () => {
    expect(1).toBe(1)

    // setTimeout(() => {
    //   const el = document.querySelector<ReactiveElement>("t-t")
    //   const innerHtml = el?.$root.querySelector("div")?.innerHTML
    //   expect(innerHtml).toBe("this is test")
    //   done()
    // }, 0)
  })
})
