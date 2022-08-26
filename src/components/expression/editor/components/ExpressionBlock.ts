import {
  ContentType,
  defineComponent,
  ComponentInitData,
  useSelf,
  useRef,
  jsx,
  useState,
  ExtractComponentInstanceType,
  ComponentExtends,
  ExtractComponentInstanceExtendsType,
  ExtractComponentStateType, ComponentInstance
} from '@textbus/core'
import {ref, shallowRef} from "vue";
import { ChangeController } from "@textbus/core/bundles/model/component";

/**
 * 表达式元素类型
 */
export type ExpressionType = 'AND' | 'OR' | 'START' | 'END' | 'BLOCK'

/**
 * 表达式块结构
 */
export type BlockAttr = {
  fieldId: number
  operator: string
  val: string
}

type ExpressionItem<T extends ExpressionType> = {
  type: T
  attrs: ExpressionContent<T>
}

type ExpressionContent<T> = T extends 'BLOCK' ? BlockAttr : undefined

type Content = {
  [K in ExpressionType]: ExpressionItem<K>
}[ExpressionType]



export interface ExpressionBlockState {
  text: string
  content: Content
}

export interface ExpressionStringModel {
  target: string
}

export interface ExpressionNumberModel {
  target: number
}

export interface ExpressionUserModel {
  /**
   * 1: 本人
   * 2: 本部门
   * 3: 本部门及下级部门
   * 4: 下级部门
   */
  my_dept_scope: number
  users: UserView[]
  user_of_dept: Array<{
    id: number
    dept: DeptView
    scope: number
  }>
}

export interface ExpressionDeptModel {
  my_dept_scope: number
  user_of_dept: Array<{
    id: number
    dept: DeptView
    scope: number
  }>
}

export interface ExpressionDictModel {
  selected: string[]
}

export interface DictOptionModel {
  id: number
  pid: number
  label: string
  value: number
  scope: number
  children?: DictOptionModel[]
}

export interface ExpressionDateModel {
  selected: string
}

export const popoverElem = shallowRef<HTMLSpanElement>()
export const editPopoverVisible = ref<boolean>(false)
export const editBlockRef = shallowRef<ExtractComponentInstanceType<typeof ExpressionBlock>>()
export const editState = ref<BlockAttr>({
  fieldId: 0,
  operator: '',
  val: ''
})

export const ExpressionBlock = defineComponent({
  type: ContentType.Text,
  name: "ExpressionBlock",
  setup(initData: ComponentInitData<ExpressionBlockState>) {
    console.log('setup start', initData)

    const self = useSelf<any, ExpressionBlockState>()
    const compRef = useRef<HTMLSpanElement>()



    return {
      render(isOutputMode, slotRender) {
        console.log('render start', self.state)
        const attrs = {
          'textbus-type': 'expression-block',
          state: JSON.stringify(self.state),
          class: 'expression-block',
          ref: compRef,
          onClick() {
            if (self.state.content.type === 'BLOCK') {
              popoverElem.value = compRef.current

              editState.value.fieldId = self.state.content.attrs.fieldId
              editState.value.operator = self.state.content.attrs.operator
              editState.value.val = self.state.content.attrs.val

              editBlockRef.value = self
              editPopoverVisible.value = true
            } else {
              editBlockRef.value = null
              popoverElem.value = null
              editPopoverVisible.value = false
            }
          }
        }

        return jsx('span', attrs, [ self.state.text ])
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