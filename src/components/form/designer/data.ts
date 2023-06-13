import { genId } from "@/components/form/designer/util/common";

export const DisplayComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'TextField',
    component: 'label-field',
    category: 'display',
    title: "标签",
    attrs: {
      value: '111111111'
    },
  },
]

export const InputComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'NumberField',
    component: 'number-input',
    category: 'form-item',
    title: "数字",
    formItemAttrs: {
      label: "数字",
    },
    attrs: {
      placeholder: '输入数字',
      min: 1,
      max: 100,
      clearable: false,
      style: `width: 100%`
    },
    children: []
  },
  {
    id: genId(),
    icon: 'TextField',
    component: 'text-input',
    category: 'form-item',
    title: "文本框",
    formItemAttrs: {
      label: "文本框",
    },
    attrs: {
      placeholder: '输入字符串',
      clearable: false,
      showWordLimit: false,
      autofocus: false,
      validateEvent: false,
      style: `width: 100%`
    }
  },

  {
    id: genId(),
    icon: 'TimeField',
    component: 'date-picker',
    category: 'form-item',
    title: "日期",
    formItemAttrs: {
      label: "日期",
    },
    attrs: {
      dateType: 'date',
      placeholder: '输入日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: `width: 100%`
    },
    children: []
  },
  {
    id: genId(),
    icon: 'TimeField',
    component: 'date-range-picker',
    category: 'form-item',
    title: "日期范围",
    formItemAttrs: {
      label: "日期范围",
    },
    attrs: {
      dateRangeType: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: `width: 100%`
    },
    children: []
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
      renderAfterExpand: false,
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
      renderAfterExpand: false,
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
    icon: 'Table',
    title: "栅格",
    attrs: {
      gutter: 4,
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
        },
        children: [],
      },

    ],
  },
  {
    id: genId(),
    component: 'table',
    category: 'layout',
    icon: 'Table',
    title: "表格",
    attrs: {  },
    children: [
      {
        id: genId(),
        component: 'tr',
        category: 'layout',
        title: "行",
        attrs: {
          colspan: 1,
        },
        children: [
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
        ],
      },
      {
        id: genId(),
        component: 'tr',
        category: 'layout',
        title: "行",
        attrs: {
          colspan: 1,
        },
        children: [
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
        ],
      },

    ],
  },
]
