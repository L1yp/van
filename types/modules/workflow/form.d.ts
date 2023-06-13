declare type FormFieldMode = 'design' | 'edit' | 'read' | 'hidden'
declare type Size = 'large' | 'default' | 'small'

/**
 * 格式化函数
 * @param value 输入值
 * @return displayValue
 */
declare type InputFormatter = (value: string | number) => string
/**
 * 解析函数
 * @param source
 * @return modelValue
 */
declare type InputParser = (source: string) => string

type DataSourceType = 'option' | 'http'

declare interface DataSource {
  type: DataSourceType
}

declare interface OptionDataSource extends DataSource {

}




declare interface FormScheme {
  name: string // map to modelValue
  label: string
  component: string
  span: number
  value?: string // fallback in without component
  writeable: boolean
  formItemAttrs?: Record<string, any>
  componentAttrs?: Record<string, any>
}

declare interface VFormScheme {
  labelPosition: 'left' | 'right' | 'top' | 'auto'
  labelWidth: string
  size: Size
  style: string
  mode: FormFieldMode
  children: ComponentConfig[]

}


declare interface CandidateComponentConfig extends Tree {
  id: string
  component: string
  category: 'form-item' | 'layout' | 'display'
  icon?: string
  title?: string
  formItemAttrs?: Record<string, any>
  attrs?: Record<string, any>
  [key: string]: any
}


declare interface ComponentConfig extends Tree {
  id: string
  component: string
  /**
   * layout 不需要配置form-item信息
   */
  category: 'form-item' | 'layout' | 'display'
  icon?: string
  formItemAttrs: Record<string, any>
  attrs: Record<string, any>,
  key: number
}

declare interface FormItemConfig {
  prop: string
  label: string
  labelWidth: string | number
  required: boolean
  error: string
  showMessage: boolean
  inlineMessage: boolean
  size: 'small' | 'default' | 'large'
}

declare interface InputConfig extends FormItemConfig {

}