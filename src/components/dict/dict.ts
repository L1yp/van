export const STATUS = 'status'
export const YESNO = 'yseno'

interface DictOption {
  label: string
  value: boolean | number | string
  children?: this[]
}

interface DictItem {
  component: 'button-group' | 'select' | 'tree-select'
  options: DictOption[]
}

interface DictConfig {
  [prop: string]: DictItem
}

export default {
  [STATUS]: {
    component: 'button-group',
    options: [
      {
        label: '正常',
        value: 0,
      },
      {
        label: '禁用',
        value: 1,
      },
    ]
  },
  [YESNO]: {
    component: 'button-group',
    options: [
      {
        label: '是',
        value: true,
      },
      {
        label: '否',
        value: false,
      },
    ]
  }
} as DictConfig