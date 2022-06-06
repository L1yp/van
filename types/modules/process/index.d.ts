declare interface ProcessDefinition {
  id?: string;
  name: string;
  key: string;
  version?: number;
  children: ProcessDefinition[],
  rk?: number;
}

declare interface ProcessFieldDefinition {
  id: number;
  process_key: string;
  name: string;
  order_no: number;
  label: string;
  description?: string;
  component_type?: number;
  db_field_type?: string;
  db_default_value?: string;
  dict_scope?: string;
  dict_ident?: string;
  update_by?: string;
  update_time?: string;
  create_time?: string;
  sort?: number;
  nullable: number
}


declare interface UpdateProcessFieldDefinitionParam {
  id: number;
  name?: string;
  order_no?: number;
  label?: string;
  description?: string;
  component_type?: number;
  db_field_type?: string;
  db_default_value?: string;
  dict_scope?: string;
  dict_ident?: string;
}

declare interface AddProcessFieldDefinitionParam {
  process_key: string;
  name: string;
  label: string;
  description?: string;
  component_type: number;
  db_field_type: string;
  db_default_value?: string;
  nullable: number
  dict_scope?: string;
  dict_ident?: string;
}

declare interface AddWFColumnParam {
  process_key: string
  column_name: string
  label: string
  db_type: string
  default_val: string
  nullable: number
  comment: string
  component_type: number
  dict_scope: string
  dict_ident: string
}

declare interface AddProcessModelDefinitionParam {
  process_key: string;
  code_prefix: string;
  code_time_pattern: string;
  code_joiner: string;
  code_suffix: string;
  code_joiner2: string;
}

declare interface ProcessModelTreeView {
  id: number;
  process_key: string;
  title: string;
  state: number;
  update_time: number;
}

declare interface ProcessModelBPMN {
  id: number;
  process_key: string;
  version: number;
  process_model_definition_id?: string;
  state: number;
  content: string;
}


declare interface ProcessInstanceView {
  id: number;
  name: string;
  assignee: UserView[];
  creator: UserView;
}

/**
 * 流程详情结构
 */
declare interface ProcessInstanceInfoView {
  id: number
  name: string
  process_instance_id: string
  process_bpmn_id: number
  process_definition_id: string

  outcomes: ProcessOutcomeView[]

  field_definition: ProcessFieldDefinition[]
  page_info: ProcessPageInfo

  current_node_key: string

  assignees: UserView[]

  creator: UserView
  update_by: string
  update_time: string
  create_time: string
  [key: string]: any
}

declare interface ProcessPageInfo {
  fields: ProcessFieldDefinition[]
  process_model_node_page: ProcessModelNodePageView
  process_model_page_scheme_view: ProcessModelPageSchemeView
}

declare interface ProcessOutcomeView {
  name: string
  order: number
  page: ProcessPageInfo
}

declare interface HistoricActivityInstanceView {
  id: string;
  activity_id: string;
  activity_name: string;
  activity_type: string;
  execution_id: string;
  process_instance_id: string;
  process_definition_id: string;
  start_time: string;
  end_time?: string;
  duration_in_millis?: number;
  delete_reason?: string;
  assignee?: UserView;
  task_id?: string;
  called_process_instance_id: string
  variables?: Record<string, any>;
  outcome: string
}

declare interface ProcessTaskCompleteParam {
  process_key: string
  process_instance_id: string
  device: string
  outcome: string
  comment?: string
  params: Record<string, any>
}

declare interface ProcessTODOTaskView {
  process_type_name: string
  process_id: number
  task_id: string
  claim_time: string
  process_key: string
  process_definition_id: string
  process_bpmn_id: number
  name: string
  creator: UserView
  create_time: string
}

