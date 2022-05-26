import {PropType} from "vue";
import {ComponentPropsOptions} from "vue";

export const VDialogProps: ComponentPropsOptions<any> = {
  modelValue: Boolean as PropType<boolean>,
  title: String as PropType<string>,
  width: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: "50%",
  },
  top: {
    type: String as PropType<string>,
    required: false,
    default: "15vh",
  },
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  appendToBody: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  lockScroll: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  customClass: {
    type: String as PropType<string>,
    required: false,
    default: "user-ext-dialog"
  },
  openDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  closeDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  closeOnClickModal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  closeOnPressEscape: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  beforeClose: Function as PropType<(done) => void>,
  draggable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  center: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  destroyOnClose: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  fullScreen: {
    type: null as unknown as PropType<null | boolean>,
    validator: (v: any) => typeof v === 'boolean' || v === null,
  },
  showFullScreen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true
  }
}

export const VDialogEmits: string[] = [
  'update:modelValue',
  'update:fullScreen',
  "open",
  "opened",
  "close",
  "closed",
  "open-auto-focus",
  "close-auto-focus",
  //
  'confirm',
  'cancel'
]