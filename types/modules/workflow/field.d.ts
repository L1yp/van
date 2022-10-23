declare type FieldScope = 'PRIVATE' | 'GLOBAL' | 'DEFAULT'
declare type FieldType = 'number' | 'text' | 'option' | 'user' | 'dept' | 'date' | 'daterange'
declare type OptionValueFrom = 'DEFAULT' | 'CLASS' | 'TABLE'
declare type OptionComponent = 'radio' | 'radio-button' | 'checkbox' | 'checkbox-button' | 'single-cascader' | 'multi-cascader' | 'single-select' | 'multi-select'
declare type UserOptionFrom = 'ALL' | 'CLASS' | 'FIXED'
declare type DateType = 'year' | 'month' | 'date' | 'datetime' | 'week'
declare type DateRangeType = 'daterange' | 'datetimerange'

declare interface FieldScheme {
  type: FieldType
}



declare interface NumberInputFieldScheme extends FieldScheme {
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
  default_value: string
}

declare interface OptionFieldScheme extends FieldScheme {
  /**
   * ui component
   */
  component: OptionComponent
  option_content: OptionFieldContent
}
 
declare type OptionFieldContent = DefaultOptionFieldScheme & ClassOptionFieldScheme & TableOptionFieldScheme


declare interface OptionFieldContentScheme {
  from: OptionValueFrom
}

declare interface DefaultOptionFieldScheme extends OptionFieldContentScheme {
  option_type_id: string
  default_value: string[]
}

declare interface ClassOptionFieldScheme extends OptionFieldContentScheme {
  class_name: string
  from_table: 'DEFAULT' | 'EXTERNAL' | string
}

declare interface TableOptionFieldScheme extends OptionFieldContentScheme {
  table_name: string
  parent_field: string
  label_field: string
  value_field: string
  disabled_field: string
  disabled_value: string
  condition: string
}

declare interface UserFieldScheme extends FieldScheme {
  multiple: boolean
  user_content: UserFieldContent
}

declare type UserFieldContent = ClassUserFieldScheme & FixedUserFieldScheme

declare interface UserFieldSchemeContent {
  from: UserOptionFrom
}

declare interface ClassUserFieldScheme extends UserFieldSchemeContent {
  class_name: string
}


declare interface FixedUserFieldScheme extends UserFieldSchemeContent {
  user_ids: string[]
}


declare interface DeptFieldScheme extends FieldScheme {
  multiple: boolean
}


declare interface DateFieldScheme extends FieldScheme {
  date_type: DateType
  format: string
  value_format: string
  default_value: string
}

declare interface DateRangeFieldScheme extends FieldScheme {
  date_range_type: DateRangeType
  format: string
  value_format: string
  default_value: string[]
}

declare type FieldSchemeContent = NumberInputFieldScheme & TextInputFieldScheme & 
OptionFieldScheme & UserFieldScheme & 
DeptFieldScheme & DateFieldScheme & 
DateRangeFieldScheme




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
  scheme: FieldSchemeContent
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
  scheme: FieldSchemeContent
}


declare interface WorkflowFieldUpdateParam {
  id: string
  remark: string
  width: number
}

declare interface WorkflowFieldRefParam {
  wf_key: string
  field_id: string
}


declare interface WorkflowFieldFindParam {
  wf_key: string
  scope: FieldScope
}


declare interface TableScheme {
  name: string
  comment: string
}