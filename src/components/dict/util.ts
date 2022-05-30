import {PropType, ComponentPropsOptions} from "vue";

export const DictTagProps: ComponentPropsOptions<any> = {
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  scope: {
    type: String as PropType<string>,
    required: false,
    default: "global"
  },
  ident: String as PropType<string>,
  val: [Number, Object, Array] as PropType<number | DictValue | number[] | DictValue[]>,
  valType: {
    type: String as PropType<'id' | 'value' | 'raw'>,
    required: false,
    default: 'value'
  }
}



export const DictInputProps: ComponentPropsOptions<any> = {
  scope: {
    type: String as PropType<string>,
    required: false,
    default: "global"
  },
  ident: String as PropType<string>,
  checkStrictly: { // 这个属性应该在配置到界面上的时候配置
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    required: false,
    default: null
  },
  placeholder: {
    type: String as PropType<string>,
    required: false,
    default: ""
  },
  valType: {
    type: String as PropType<'id' | 'value'>,
    required: false,
    default: 'value'
  }
}


export const DictInputEmits: string[] = [
  "update:modelValue"
]