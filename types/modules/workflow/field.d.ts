declare type FieldScope = 'PRIVATE' | 'GLOBAL' | 'DEFAULT'
declare type FieldType = 'number' | 'text' | 'option' | 'user' | 'dept'
declare type OptionValueFrom = 'DEFAULT' | 'CLASS' | 'TABLE'
declare type OptionComponent = 'radio' | 'radio-button' | 'checkbox' | 'checkbox-button' | 'select' | 'cascader' | 'tree-select'
declare type UserOptionFrom = 'ALL' | 'CLASS' | 'FIXED'

declare interface FieldScheme {
  type: FieldType
}

declare interface NumberInputFieldScheme extends FieldScheme {
  type: 'number'
  /**
   * 格式化函数
   */
  formatter: string
  /**
   * 解析函数
   */
  parser: string
  min: number
  max: number
  default_value: number
  precision: number
}

declare interface TextInputFieldScheme extends FieldScheme {
  type: 'text'
  default_value: string
}

declare interface OptionFieldScheme extends FieldScheme {
  type: 'option'
  from: OptionValueFrom
  /**
   * ui component
   */
  component: OptionComponent
}


declare interface DefaultOptionFieldScheme extends OptionFieldScheme {
  option_type_id: string
  default_value: string
}

declare interface ClassOptionFieldScheme extends OptionFieldScheme {
  class_name: string
  from_table: 'DEFAULT' | 'EXTERNAL' | string
}

declare interface UserFieldScheme extends FieldScheme {
  type: 'user',
  multiple: boolean
  from: UserOptionFrom
}

declare interface ClassUserFieldScheme extends UserFieldScheme {
  from: 'CLASS',
  class_name: string
}


declare interface FixedUserFieldScheme extends UserFieldScheme {
  from: 'FIXED',
  user_ids: string[]
}


declare interface DeptFieldScheme extends FieldScheme {
  type: 'dept',
  multiple: boolean
}

/////////////////

declare interface WorkflowFieldDefView {
  id: string
  field: string
  label: string
  remark: string
  width: number
  /**
   * 字段类型
   */
  type: string
  scope: FieldScope
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}


declare interface WorkflowFieldAddParam {
  wf_key: string
  field: string
  label: string
  remark: string
  width: number
  /**
   * 字段类型
   */
  type: string
  scope: FieldScope
  scheme: FieldScheme
}


declare interface WorkflowFieldUpdateParam {
  id: string
  remark: string
  width: number
  /**
   * 字段类型
   */
  type: FieldType
  scheme: FieldScheme
}

declare interface WorkflowFieldRefParam {
  wf_key: string
  field_id: string
}


declare interface WorkflowFieldFindParam {
  wf_key: string
  scope: FieldScope
}


