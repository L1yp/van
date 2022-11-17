declare interface WorkflowTypeDefPageParam extends PageParam {
  name?: string
  remark?: string
  updateBy?: string[]
  createBy?: string[]
}

declare interface WorkflowTypeDefView {
  id: string
  key: string
  name: string
  remark: string
  code_gen_rule: CodeGenRule
  status: string
  update_by: string
  update_time: string
  create_by: string
  create_time: string
  children: WorkflowTypeVerView[]
}

declare interface WorkflowTypeVerView {
  id: string
  key: string
  name?: string // add
  ver: number
  remark: string
  status: string
  xml: string
  process_definition_id: string
  update_by: string
  update_time: string
  create_by: string
  create_time: string
}

declare type CodeGenType = 'fixed' | 'class'

declare interface CodeGenRule {
  type: CodeGenType
}

declare interface FixedGenRule extends CodeGenRule {
  prefix: string
  delimiter?: string
  date_format: string
  joiner?: string
  num_format: number
}

declare interface ClassGenRule extends CodeGenRule {
  class_name: string
}


declare interface WorkflowTypeDefAddParam {
  key: string
  name: string
  remark: string
  code_gen_rule: CodeGenRule
  status: number
}

declare interface WorkflowTypeDefUpdateParam {
  id: string
  name: string
  remark: string
  code_gen_rule: CodeGenRule
  status: string
}

declare type WorkflowTypeVerUpdateXmlParam = {
  id: string
  xml: string
}


declare interface WorkflowTypeVerActiveParam {
  id: string
  remark: string
}


declare interface WorkflowTypeVerPendingParam {
  id: string
}
