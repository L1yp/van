declare type OptionScope = 'ENTITY_PRIVATE' | 'WORKFLOW_PRIVATE' | 'GLOBAL'

declare interface ModelingOptionTypeView {
  id: string
  name: string
  remark: string
  scope: OptionScope
  mkey: string
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}

declare interface ModelingOptionTypeFindParam {
  mkey?: string
  scope?: OptionScope
}

declare interface ModelingOptionTypeAddParam {
  mkey: string
  name: string
  remark: string
  scope: OptionScope
}

declare interface ModelingOptionTypeUpdateParam {
  id: string
  name: string
  remark: string
}


declare interface ModelingOptionValueView extends Tree {
  id: string
  type_id: string
  name: string
  disabled: boolean
  pid: string
  order_no: number
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}


declare interface ModelingOptionValueFindParam {
  typeId: string
}


declare interface ModelingOptionValueAddParam {
  type_id: string
  name: string
  pid: string
  order_no: number
  disabled: boolean
}

declare interface ModelingOptionValueUpdateParam {
  id: string
  name: string
  pid: string
  order_no: number
}
