import { ComponentLoader } from '@textbus/browser';
import {
  ContentType,
  defineComponent,
  ComponentInitData,
  useSelf,
  useRef,
  jsx,
  ExtractComponentInstanceType, VElement,
} from '@textbus/core'
import {ref, shallowRef} from "vue";
import { transformToVElementLang } from "../util";

export type ExpressionItem<T extends ExpressionType> = {
  type: T
  attrs: ExpressionContent<T>
}

export type ExpressionContent<T> = T extends 'BLOCK' ? BlockExpressionModel : undefined

export type Content = {
  [K in ExpressionType]: ExpressionItem<K>
}[ExpressionType]



export interface ExpressionBlockState {
  text: string
  content: ExpressionModel
}

export const popoverElem = shallowRef<HTMLSpanElement | null>(null)
export const editPopoverVisible = ref<boolean>(false)
export const editBlockRef = shallowRef<ExtractComponentInstanceType<typeof ExpressionBlock> | null>(null)
export const editState = ref<BlockExpressionModel>({
  field: '',
  operator: 'EQ',
  value: undefined
})

export const ExpressionBlock = defineComponent({
  type: ContentType.Text,
  name: "ExpressionBlock",
  setup(initData: ComponentInitData<ExpressionBlockState>) {
    // console.log('setup start', initData)

    const self = useSelf<any, ExpressionBlockState>()
    const compRef = useRef<HTMLSpanElement>()



    return {
      render() {
        // console.log('render start', self.state)
        const attrs = {
          'textbus-type': 'expression-block',
          state: JSON.stringify(self.state),
          class: 'expression-block',
          type: self.state.content.type,
          ref: compRef,
          onClick() {
            if (self.state.content.type === 'BLOCK') {
              if (popoverElem.value === compRef.current) {
                editPopoverVisible.value = !editPopoverVisible.value
                // reclick hidden popover
                return
              } else if (!!popoverElem.value && !!compRef.current && editPopoverVisible.value) {
                // console.log('请先关闭当前弹框');

                return
              }
              popoverElem.value = compRef.current

              // editState.value.field = self.state.content.attrs.field
              // editState.value.operator = self.state.content.attrs.operator
              // editState.value.value = self.state.content.attrs.value

              editState.value = self.state.content.content
              // editState.value = JSON.parse(JSON.stringify(self.state.content.attrs))


              editBlockRef.value = self
              editPopoverVisible.value = true
            } else {
              editBlockRef.value = null
              popoverElem.value = null
              editPopoverVisible.value = false
            }
          }
        }

        if (self.state.content.type === 'BLOCK') {
          const elems = transformToVElementLang(self.state.text)
          console.log('transform elems', elems);

          return VElement.createElement('span', attrs, elems)
        } else {
          return VElement.createElement('span', attrs, [ self.state.text ])
        }

      }
    }
  }
})


export const expressionBlockLoader: ComponentLoader = {
  match(element) {
    return element.tagName.toLowerCase() === "span" && element.hasAttribute("component-type") && element.getAttribute("component-type") === "expression-block";
  },
  read(element, injector) {
    console.log("read", element)
    const state = element.getAttribute("state");
    return ExpressionBlock.createInstance(injector, {
      slots: [],
      state: state ? JSON.parse(state) : {},
    })
  },
}