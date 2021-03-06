import {
  component,
  html,
  ReactiveElement,
  useEffect,
  useState,
  repeat
} from "@gallop/gallop"

component("sand-box", function (this: ReactiveElement) {
  useEffect(() => {
    console.dir(this)
  }, [])

  const [state] = useState({ flag: true })
  return html`<div class="sandbox">
    <!-- <link rel="stylesheet" .href="{0}" /> -->
    <div>
      ${state.flag ? html`<div>${String(state.flag)}</div>` : 2}
    </div>
    <div>${state.flag ? 1 : 2}</div>
    <button
      @click="${() => {
        state.flag = !state.flag
      }}"
    >
      change
    </button>
    <hr />
    <div>
      ${repeat(
        [1, 2, 3],
        (v) => v,
        (v) => html`<div>*${v}*</div>`
      )}
    </div>
    <button>roll</button>
  </div>`
})
