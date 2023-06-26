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

declare interface WorkflowTypeVerCopyParam {
  id: string
}

declare interface WorkflowInstanceStartParam {
  mkey: string
  data: Record<string, any>
}

declare interface WorkflowInstanceCreateResult {
  id: string
  process_instance_id: string
}

declare interface WorkflowTaskCompleteParam {
  mkey: string
  task_id: string
  data: Record<string, any>
  outcome: string
  comment?: string
}

declare interface WorkflowInstanceQueryParam {
  mkey: string
  instanceId: string
}

declare interface TaskCommentMessage {
  type: 'complete' | 'comment'
  outcome: string
  comment: string
}

declare interface TaskComment {
  id: string
  type: string
  time: string
  user_id: string
  task_id: string
  process_instance_id: string
  action: string
  message: TaskCommentMessage
}

declare interface WorkflowOutcomeInfo {
  name: string
  page_info: ModelingPageView
}

declare interface WorkflowInstanceDetailsResult {
  page_info: ModelingPageView
  outcomes: WorkflowOutcomeInfo[]
  activity_list: WorkflowActivityInfo[]
  instance_info: Record<string, any>
  xml: string
  user_map: Record<string, UserView>
  comment_list: TaskComment[]
  task_id: string
}


declare interface WorkflowActivityInfo {
  id: string
  activity_id: string
  activity_name: string
  activity_type: string
  execution_id: string
  process_instance_id: string
  process_definition_id: string
  duration_in_millis: number
  start_time: string
  end_time: string
  assignee: string
  task_id: string
  delete_reason: string
  called_process_instance_id: string
  outcome: string
}

declare interface WorkflowTaskFindParam extends PageParam {
  name?: string
}

declare interface WorkflowTaskView {
  task_id: string
  mkey: string
  workflow_type: string
  process_instance_id: string
  process_definition_id: string
  task_def_key: string
  claim_time: string
  assignee: string
  create_time: string
  process_instance_name: string

  start_time: string
  start_user_id: string
}
