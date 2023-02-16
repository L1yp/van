declare type FieldScope = 'ENTITY_PRIVATE' | 'WORKFLOW_PRIVATE' | 'GLOBAL' | 'WORKFLOW_DEFAULT' | 'ENTITY_DEFAULT'
declare type ModelingModule = 'ENTITY' | 'WORKFLOW'
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
  /**
   * 精度：小数位数
   */
  precision: number
}

declare interface TextInputFieldScheme extends FieldScheme {
  defaultValue: string
}

declare interface OptionFieldScheme extends FieldScheme {
  multiple: boolean
  /**
   * ui component
   */
  optionComponent: OptionComponent
  optionTypeId: string
  optionDefaultValue: string[]

  options?: ModelingOptionValueView[]

}



declare interface UserFieldScheme extends FieldScheme {
  multiple: boolean
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

declare interface ModelingFieldDefView {
  id: string
  field: string
  label: string
  remark: string
  width: number
  /**
   * 字段类型
   */
  type: FieldType
  scope: FieldScope
  scheme: FieldSchemeContent
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}


declare interface ModelingFieldAddParam {
  mkey?: string
  field: string
  label: string
  remark: string
  width: number
  /**
   * 字段类型
   */
  type: string
  scope: FieldScope
  scheme: Partial<FieldSchemeContent>
}


declare interface ModelingFieldUpdateParam {
  id: string
  remark: string
  width: number
}

declare interface ModelingFieldRefParam {
  mkey: string
  module: ModelingModule
  field_id: string
}


declare interface TableScheme {
  name: string
  comment: string
}