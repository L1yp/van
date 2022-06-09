import {ComponentPropsOptions, PropType} from "vue";


export const UserSelectorModelProps: ComponentPropsOptions<any> = {
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  modelValue: {
    type: null as unknown as PropType<UserView | UserView[] | null>,
    validator: (v: any) => typeof v === 'object' || v === null || Array.isArray(v) || v === undefined,
  }
}

export const UserSelectorModelEmits: string[] = [
  "update:modelValue"
]


export const UserSelectorInputProps: ComponentPropsOptions<any> = {
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  modelValue: {
    type: null as unknown as PropType<UserView | UserView[] | null>,
    required: true,
    validator: (v: any) => ['number', 'string', 'object'].includes(typeof v) || v === null || Array.isArray(v) || v === undefined,
  },
  valueKey: {
    type: String as PropType<string>,
    required: false,
    default: null
  },
  readViewFn: Function as PropType<(param: number | number[] | string | string[]) => UserView>,
  placeholder: {
    type: String as PropType<string>,
    required: false,
    default: '双击选择用户'
  },
}

export const UserSelectorInputEmits = [
  'update:modelValue'
]