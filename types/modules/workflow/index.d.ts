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

declare type CodeGenType = 'class' | 'fixed'
declare type CodeGenByClass = {
  className: string
}

declare type GenFixedCode = {
  prefix: string
  delimiter?: string
  dateFormat: string
  joiner?: string
  numFormat: string
}

declare type CodeGenContent<T extends CodeGenType> = T extends 'class' ? CodeGenByClass : GenFixedCode


declare interface CodeGenRule<T extends CodeGenType> {
  type: CodeGenType
  content: CodeGenContent<T>
}

type FixedGenRule = CodeGenRule<'fixed'>
type ClassGenRule = CodeGenRule<'class'>
