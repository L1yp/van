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
      label: "单行文本框",
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
    icon: 'Edit',
    component: 'text-area-input',
    category: 'form-item',
    title: "多行文本框",
    formItemAttrs: {
      label: "多行文本框",
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
    icon: 'RadioButton',
    component: 'single-select',
    category: 'form-item',
    title: "单选框",
    formItemAttrs: {
      label: "单选框",
    },
    attrs: {
      placeholder: '选择一个选项',
      clearable: false,
      size: 'default',
      expand: false,
      buttonOption: false,
      options: [
        {
          id: '1',
          name: 'Option1',
          disabled: false,
        },
        {
          id: '2',
          name: 'Option2',
          disabled: true,
        },
        {
          id: '3',
          name: 'Option3',
          disabled: false,
        },
      ],
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'CheckboxChecked',
    component: 'multi-select',
    category: 'form-item',
    title: "多选框",
    formItemAttrs: {
      label: "多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      placeholder: '选择多个选项',
      clearable: false,
      size: 'default',
      expand: false,
      buttonOption: false,
      options: [
        {
          id: '1',
          name: 'Option1',
          disabled: false,
        },
        {
          id: '2',
          name: 'Option2',
          disabled: true,
        },
        {
          id: '3',
          name: 'Option3',
          disabled: false,
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
      label: "用户单选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: false,
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
      label: "用户多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: true,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'Department',
    component: 'dept-select',
    category: 'form-item',
    title: "部门单选框",
    formItemAttrs: {
      label: "部门单选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: false,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'Department',
    component: 'dept-select',
    category: 'form-item',
    title: "部门多选框",
    formItemAttrs: {
      label: "部门多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: true,
      placeholder: '',
      style: `width: 100%`
    }
  },
]
export const LayoutComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    component: 'el-row',
    category: 'layout',
    title: "栅格",
    attrs: {
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
        title: "格子",
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          tag: 'div',
        },
        children: [],
      },
      
    ],
  }
]
