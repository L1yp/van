export interface FormScheme {
  name: string // map to modelValue
  label: string
  component: string
  span: number
  value?: string // fallback in without component
  writeable: boolean
  formItemAttrs?: Record<string, any>
  componentAttrs?: Record<string, any>
}

export interface CandidateComponentConfig {
  id: string
  component: string
  icon?: string
  title?: string
  formItemAttrs?: Record<string, any>
  attrs?: Record<string, any>
  children?: CandidateComponentConfig[]
}


export interface ComponentConfig {
  id: string
  component: string
  icon?: string
  formItemAttrs?: Record<string, any>
  attrs?: Record<string, any>,
  children?: ComponentConfig[]
}

export interface FormItemConfig {
  prop: string
  label: string
  labelWidth: string | number
  required: boolean
  error: string
  showMessage: boolean
  inlineMessage: boolean
  size: 'small' | 'default' | 'large'
}

export interface InputConfig extends FormItemConfig {

}