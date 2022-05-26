import {ComponentPropsOptions, PropType} from "vue";


export const VSelectProps: ComponentPropsOptions<any> = {
  options: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  keyField: {
    type: String,
    required: false,
    default: 'key'
  },
  labelField: {
    type: String,
    required: false,
    default: 'label'
  },
  valueField: {
    type: String,
    required: false,
    default: 'value'
  },
  modelValue: {
    type: null as unknown as PropType<string | string[] | number | number[] | any | any[]>,
    required: true,
    validator: v => v === null || v === undefined || ['string', 'number', 'object'].includes(typeof v) || Array.isArray(v)
  },
  selectAttrs: {
    type: Object as PropType<Record<string, any>>,
    required: false,
    default: { }
  }
}