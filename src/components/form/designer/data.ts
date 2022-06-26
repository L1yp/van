import {CandidateComponentConfig, SelectConfig} from "@/components/form/types";
import {genId} from "@/components/form/designer/util/common";


export const InputComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'TextField',
    component: 'el-input',
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
      style: {
        width: '100%',
      }
    }
  },
  {
    id: genId(),
    icon: 'Select',
    component: 'el-select',
    category: 'form-item',
    title: "下拉框",
    formItemAttrs: {
      prop: genId(),
      label: "下拉框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      multiple: false,
      disabled: false,
      size: 'default',
      clearable: false,
      collapseTags: false,
      collapseTagsTooltip: false,
      multipleLimit: 0,
      name: '',
      effect: 'light',
      autocomplete: 'off',
      placeholder: '',
      filterable: false,
      allowCreate: false,
      // filterMethod: new Function('() => {}'),
      remote: false,
      // remoteMethod: new Function('() => {}'),
      loading: false,
      loadingText: 'Loading',
      noMatchText: 'No matching data',
      noDataText: 'No data',
      popperClass: '',
      reserveKeyword: true,
      defaultFirstOption: false,
      teleported: true,
      persistent: true,
      automaticDropdown: false,
      // clearIcon: 'CircleClose',
      fitInputWidth: true,
      // suffixIcon: 'ArrowUp',
      tagType: 'info',
      style: {
        width: '100%',
      }
    },
    options: {
      type: 'fixed',
      value: [
        {
          label: 'Option1',
          value: 1,
        },
        {
          label: 'Option2',
          value: 2,
        },
        {
          label: 'Option3',
          value: 3,
        },
        {
          label: 'Option4',
          value: 4,
        },
      ]
    }
  },
  {
    id: genId(),
    icon: 'config',
    component: 'dict-input',
    category: 'form-item',
    title: "字典输入框",
    formItemAttrs: {
      prop: genId(),
      label: "字典输入框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      multiple: false,
      checkStrictly: false,
      scope: 'global',
      ident: 'common_status',
      valType: 'id'
    }
  },
  {
    id: genId(),
    icon: 'User',
    component: 'user-selector-input',
    category: 'form-item',
    title: "用户输入框",
    formItemAttrs: {
      prop: genId(),
      label: "用户输入框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      multiple: false,
      placeholder: '',
      style: {
        width: '100%'
      }
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
