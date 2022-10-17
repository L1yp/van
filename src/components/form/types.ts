export type FormFieldMode = 'design' | 'edit' | 'read' | 'hidden'
export type InputFormatter = (value: string | number) => string
export type InputParser = (string) => string
export type InputProps = {
  placeholder?: string
  clearable?: boolean
  formatter?: InputFormatter
  parser?: InputParser
  showWordLimit?: boolean
}

export type InputAreaProps = {
  placeholder?: string
  clearable?: boolean
  formatter?: InputFormatter
  parser?: InputParser
}



export interface VFormDesignerScheme {
  width: string
  labelPosition: 'left' | 'right' | 'top'
  labelWidth: string
  size: 'large' | 'default' | 'small'
  css: string
  class: string
}

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
  category: 'form-item' | 'layout' | 'output'
  icon?: string
  title?: string
  formItemAttrs?: Record<string, any>
  attrs?: Record<string, any>
  children?: CandidateComponentConfig[]
  [key: string]: any
}


export interface ComponentConfig {
  id: string
  component: string
  category: 'form-item' | 'layout' | 'output'
  icon?: string
  formItemAttrs?: Record<string, any>
  attrs?: Record<string, any>,
  children?: ComponentConfig[]
  key: number
  modelValue?: any
  injectFunc?: string
}

interface SelectOptionFixedValue {
  label: string
  value: string
}

interface SelectOptionDictValue {
  scope: string
  ident: string
}

interface SelectOptionUrlValue {

}

interface SelectOption {
  type: 'fixed' | 'dict' | 'url'
  value: SelectOptionFixedValue[] | SelectOptionDictValue | SelectOptionUrlValue
}

export interface SelectConfig extends ComponentConfig {
  options: SelectOption
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