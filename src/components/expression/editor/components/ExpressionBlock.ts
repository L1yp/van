import { ContentType, defineComponent, VElement, ComponentInitData } from '@textbus/core'

export interface ExpressionBlockState {
  content: string
}

export const ExpressionBlock = defineComponent({
  type: ContentType.Text,
  name: "ExpressionBlock",
  setup(initData: ComponentInitData<ExpressionBlockState>) {
    return {
      render(isOutputMode, slotRender) {

        const state = initData.state

        const attrs = {
          'textbus-type': 'expression-block',
          state: JSON.stringify(state),
          class: 'expression-block'
        }

        return VElement.createElement('span', attrs, [ state.content ])
      }
    }
  }
})


export const expressionBlockLoader = {
  match(element) {
    return element.tagName.toLowerCase() === "span" && element.hasAttribute("component-type") && element.getAttribute("component-type") === "expression-block";
  },
  read(element, injector) {
    console.log("read", element)
    const state = element.getAttribute("state");
    return ExpressionBlock.createInstance(injector, {
      slots: [],
      state: JSON.parse(state),
    })
  },
}