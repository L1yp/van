declare type FieldScope = 'PRIVATE' | 'GLOBAL' | 'DEFAULT'
declare type FieldType = 'number' | 'text' | 'option' | 'user' | 'dept' | 'date' | 'daterange'
declare type OptionValueFrom = 'DEFAULT' | 'CLASS' | 'TABLE'
declare type OptionComponent = 'radio' | 'radio-button' | 'checkbox' | 'checkbox-button' | 'single-select' | 'multi-select'
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
  defaultValue: number
  precision: number
}

declare interface TextInputFieldScheme extends FieldScheme {
  defaultValue: string
}

declare interface OptionFieldScheme extends FieldScheme {
  /**
   * ui component
   */
  component: OptionComponent
  optionContent: OptionFieldContent
}
 
declare type OptionFieldContent = DefaultOptionFieldScheme & ClassOptionFieldScheme & TableOptionFieldScheme


declare interface OptionFieldContentScheme {
  from: OptionValueFrom
}

declare interface DefaultOptionFieldScheme extends OptionFieldContentScheme {
  optionTypeId: string
  defaultValue: string[]
}

declare interface ClassOptionFieldScheme extends OptionFieldContentScheme {
  className: string
  fromTable: 'DEFAULT' | 'EXTERNAL' | string
}

declare interface TableOptionFieldScheme extends OptionFieldContentScheme {
  tableName: string
  parentField: string
  labelField: string
  valueField: string
  disabledField: string
  disabledValue: string
  condition: string
}

declare interface UserFieldScheme extends FieldScheme {
  multiple: boolean
  userContent: UserFieldContent
}

declare type UserFieldContent = ClassUserFieldScheme & FixedUserFieldScheme

declare interface UserFieldSchemeContent {
  from: UserOptionFrom
}

declare interface ClassUserFieldScheme extends UserFieldSchemeContent {
  className: string
}


declare interface FixedUserFieldScheme extends UserFieldSchemeContent {
  userIds: string[]
}


declare interface DeptFieldScheme extends FieldScheme {
  multiple: boolean
}


declare interface DateFieldScheme extends FieldScheme {
  dateType: DateType
  format: string
  valueFormat: string
  defaultValue: string
}

declare interface DateRangeFieldScheme extends FieldScheme {
  dateRangeType: DateRangeType
  format: string
  valueFormat: string
  defaultValue: string[]
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