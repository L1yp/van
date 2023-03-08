declare interface ModelingPermissionFindParam {
  roleId: string
  module: ModelingModule
  mkey: string
}

declare interface ModelingPermissionBindParam {
  role_id: string
  module: ModelingModule
  mkey: string
  flags: number
  content: ExpressionModel[]
}

declare type ExpressionType = 'BLOCK' | 'AND' | 'OR' | 'START' | 'END'
declare type ConditionOperator = 'EQ' | 'LIKE' | 'NOT_LIKE' | 'GT' | 'GTE' | 'LT' | 'LTE'
declare type DateConditionType = 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'FIXED'


declare interface ExpressionModel {
  type: ExpressionType
  content: BlockExpressionModel
}

declare interface BlockExpressionModel {
  field: string
  operator: ConditionOperator
  value?: FieldConditionUnionModel
}

declare interface FieldConditionModel {
  type: FieldType
}

declare type FieldConditionUnionModel = Partial<TextFieldConditionModel & DateFieldConditionModel & OptionFieldConditionModel & UserFieldConditionModel & DeptFieldConditionModel & NumberFieldConditionModel>

declare interface TextFieldConditionModel extends FieldConditionModel{
  text: string
}

declare interface DateFieldConditionModel extends FieldConditionModel{
  data_type: DateConditionType
  range?: string
}


declare interface OptionFieldConditionModel extends FieldConditionModel{
  option_value_id_list: string[]
}


declare interface UserFieldConditionModel extends FieldConditionModel {
  /**
   * 用户ID列表
   */
  user_id_list: string[]
  dept_id?: string
  cascader: boolean
}

declare interface DeptFieldConditionModel extends FieldConditionModel {
  dept_id?: string
  cascader: boolean
}

declare interface NumberFieldConditionModel extends FieldConditionModel {
  number: number
}

declare interface ModelingPermissionView {
  id: string
  role_id: string
  module: ModelingModule
  mkey: string
  flags: number
  content: ExpressionModel[]
}