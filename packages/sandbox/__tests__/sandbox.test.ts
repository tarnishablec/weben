"use strict"

import {
  component,
  html,
  ReactiveElement,
  render
} from "@gallop/gallop"

describe("test", () => {
  component("t-t", function () {
    return html`<div>this is test</div>`
  })

  render(html`<t-t></t-t>`)

  test("adds 1 + 2 to equal 3", (done) => {
    // expect(func()).toBe(res)

    setTimeout(() => {
      const el = document.querySelector<ReactiveElement>("t-t")
      const innerHtml = el?.$root.querySelector("div")?.innerHTML
      expect(innerHtml).toBe("this is test")
      done()
    }, 0)
  })
})
