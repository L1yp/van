import {CandidateComponentConfig, SelectConfig} from "@/components/form/types";
import {genId} from "@/components/form/designer/util/common";


export const InputComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'TextField',
    component: 'text-input',
    category: 'form-item',
    title: "单行文本框",
    formItemAttrs: {
      prop: genId(),
      label: "单行文本框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      value: '1111111',
      placeholder: '输入字符串',
      clearable: false,
      showWordLimit: false,
      size: 'default',
      autofocus: false,
      validateEvent: false,
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'TextField',
    component: 'text-area-input',
    category: 'form-item',
    title: "多行文本框",
    formItemAttrs: {
      prop: genId(),
      label: "多行文本框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      value: '1111111',
      placeholder: '输入字符串',
      clearable: false,
      showWordLimit: false,
      size: 'default',
      rows: 2,
      autoresize: true,
      resize: 'none',
      autofocus:false,
      validateEvent: false,
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'TextField',
    component: 'single-select',
    category: 'form-item',
    title: "下拉单选框",
    formItemAttrs: {
      prop: genId(),
      label: "下拉单选框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      placeholder: '选择一个选项',
      clearable: false,
      showWordLimit: false,
      size: 'default',
      options: [
        {
          id: '1',
          name: 'Option1',
          disblaed: false,
        },
        {
          id: '2',
          name: 'Option2',
          disblaed: true,
        },
        {
          id: '3',
          name: 'Option3',
          disblaed: false,
        },
      ],
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'TextField',
    component: 'multi-select',
    category: 'form-item',
    title: "下拉多选框",
    formItemAttrs: {
      prop: genId(),
      label: "下拉多选框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      placeholder: '选择多个选项',
      clearable: false,
      showWordLimit: false,
      size: 'default',
      options: [
        {
          id: '1',
          name: 'Option1',
          disblaed: false,
        },
        {
          id: '2',
          name: 'Option2',
          disblaed: true,
        },
        {
          id: '3',
          name: 'Option3',
          disblaed: false,
        },
      ],
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'User',
    component: 'user-select',
    category: 'form-item',
    title: "用户单选框",
    formItemAttrs: {
      prop: genId(),
      label: "用户单选框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default',
    },
    attrs: {
      multi: false,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'User',
    component: 'user-select',
    category: 'form-item',
    title: "用户多选框",
    formItemAttrs: {
      prop: genId(),
      label: "用户多选框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default',
    },
    attrs: {
      multi: true,
      placeholder: '',
      style: `width: 100%`
    }
  },
]
export const OutputComponents: CandidateComponentConfig[] = []
export const LayoutComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    component: 'el-row',
    category: 'layout',
    title: "栅格",
    attrs: {
      style: {
        minHeight: '120px',
        marginTop: '16px'
      },
      gutter: 0,
      justify: 'start',
      align: 'top',
      tag: 'div',
    },
    children: [
      {
        id: genId(),
        component: 'el-col',
        category: 'layout',
        title: "栅格",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          tag: 'div',
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      },
      {
        id: genId(),
        component: 'el-col',
        category: 'layout',
        title: "栅格",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          tag: 'div',
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      }
    ],
  }
]
