declare type OptionScope = 'PRIVATE' | 'GLOBAL'

declare interface WorkflowOptionTypeView {
  id: string
  name: string
  remark: string
  scope: OptionScope
  wf_key: string
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}

declare interface WorkflowOptionTypeFindParam {
  wf_key?: string
  scope?: OptionScope
}

declare interface WorkflowOptionTypeAddParam {
  name: string
  remark: string
  scope: OptionScope
}

declare interface WorkflowOptionTypeUpdateParam {
  id: string
  name: string
  remark: string
}


declare interface WorkflowOptionValueView extends Tree {
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


declare interface WorkflowOptionValueFindParam {
  typeId: string
}


declare interface WorkflowOptionValueAddParam {
  type_id: string
  name: string
  pid: string
  order_no: number
}

declare interface WorkflowOptionValueUpdateParam {
  id: string
  name: string
  pid: string
  order_no: number
}
