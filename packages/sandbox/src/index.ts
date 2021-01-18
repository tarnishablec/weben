import {
  component,
  render,
  html,
  ReactiveElement,
  useEffect
} from "@gallop/gallop"

component("sand-box", function (this: ReactiveElement) {
  useEffect(() => {
    console.dir(this)
  }, [])
  return html`<div class="sandbox">this is sandbox</div>`
})

render(html`<sand-box></sand-box>`)

export { test } from "./test"
