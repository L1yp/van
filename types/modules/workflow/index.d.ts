declare interface WorkflowTypeDefPageParam extends PageParam {
  name?: string
  remark?: string
}

declare interface WorkflowTypeDefView {
  id: string
  key: string
  name: string
  remark: string
  code_gen_rule: string
  status: string
  update_by: string
  update_time: string
  create_by: string
  create_time: string
  children: WorkflowTypeVerView[]
}

declare interface WorkflowTypeVerView {
  id: string
  wf_key: string
  name?: string // add
  ver: number
  remark: string
  status: string
  update_by: string
  update_time: string
  create_by: string
  create_time: string
}

