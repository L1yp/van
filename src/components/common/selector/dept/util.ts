import {PropType, ComponentPropsOptions} from "vue";


export const DeptSelectorModelProps: ComponentPropsOptions<any> = {
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  modelValue: {
    type: null as unknown as PropType<DeptView | DeptView[] | null>,
    validator: (v: any) => typeof v === 'object' || v === null || Array.isArray(v),
  }
}

export const DeptSelectorModelEmits: string[] = [
  "update:modelValue"
]


export const DeptSelectorInputProps: ComponentPropsOptions<any> = {
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  modelValue: {
    type: null as unknown as PropType<number | number[] | string | string[] | DeptView | DeptView[] | null>,
    required: true,
    validator: (v: any) => ['number', 'string', 'object'].includes(typeof v) || v === null || Array.isArray(v),
  },
  valueKey: {
    type: String as PropType<string>,
    required: false,
    default: null
  },
  readViewFn: Function as PropType<(param: number | number[] | string | string[]) => DeptView>
}

export const DeptSelectorInputEmits = [
  'update:modelValue'
]