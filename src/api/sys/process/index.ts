import {request} from "@/api/request";


/************新版API***************/

/**
 * 流程列表
 * @param processKey
 */
export function processInstanceByProcessKey(processKey: string): Promise<ProcessInstanceView[]> {
  const params = {processKey}
  return request<ProcessInstanceView[]>({
    method: 'get',
    url: `/process/instance/list`,
    params
  })
}

/**
 * 查询流程字段列表
 * @param processKey 流程标识
 */
export function loadProcessFieldDefinition(processKey: string): Promise<ProcessFieldDefinition[]> {
  return request<ProcessFieldDefinition[]>({
    method: 'get',
    url: `/process/model/field/definition/${processKey}`,
  })
}

/**
 * 创建流程字段
 * @param params 字段定义
 */
export function createProcessFieldDefinition(data: AddProcessFieldDefinitionParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/field/definition/create`,
    data
  })
}

/**
 * 更新流程字段
 * @param params 字段定义
 */
export function updateProcessFieldDefinition(data: UpdateProcessFieldDefinitionParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/field/definition/update`,
    data
  })
}


/**
 * 删除流程字段
 * @param id 字段定义ID
 */
export function deleteProcessFieldDefinitionById(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/process/model/field/definition/${id}`,
  })
}

/**
 * 批量删除流程字段
 * @param ids 字段定义ID列表
 */
export function batchDeleteProcessFieldDefinition(ids: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/process/model/field/definition/batch/${ids}`,
  })
}

/**
 * 获取流程历史
 * @param processInstanceId 流程实例ID
 */
export function readProcessHistory(processInstanceId: string): Promise<HistoricActivityInstanceView[]> {
  const params = { processInstanceId }
  return request<HistoricActivityInstanceView[]>({
    method: 'get',
    url: `/process/instance/history`,
    params
  })

}

/********流程模型接口*********/
/**
 * 获取某个流程图绑定的界面列表
 */
export function listProcessPageByBpmnId(bpmnId: number): Promise<ProcessModelNodePageView[]> {
  const params = { bpmnId }
  return request<ProcessModelNodePageView[]>({
    method: 'get',
    url: `/process/model/page/listByBpmnId`,
    params
  })
}

/**
 * 查询流程模型列表
 */
export function listProcessModel(): Promise<ProcessModelTreeView[]> {
  return request<ProcessModelTreeView[]>({
    method: 'get',
    url: `/process/model/definition/list`
  })
}

/**
 * 创建流程模型
 * @param data 参数
 */
export function createProcessModel(data: AddProcessModelDefinitionParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/definition/create`,
    data
  })
}

/**
 * 获取一个 BPMN版本
 * @param id
 */
export function findProcessModelBPMN(id: number): Promise<ProcessModelBPMN> {
  return request<ProcessModelBPMN>({
    method: 'get',
    url: `/process/model/bpmn/${id}`
  })
}

/**
 * 创建流程图版本
 * @param process_key 流程标识
 */
export function createProcessModelBPMN(process_key: string): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/bpmn/create`,
    data: { process_key }
  })
}

/**
 * 创建流程图版本
 * @param process_model_bpmn_id 流程BPMN ID
 */
export function copyProcessModelBPMN(process_model_bpmn_id: number): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/bpmn/copy`,
    data: { process_model_bpmn_id }
  })
}


/**
 * 更新流程图版本
 * @param id 流程BPMN ID
 * @param content XML内容
 */
export function persistProcessModelXML(id: number, content: string): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/bpmn/persist/xml`,
    data: { id, content }
  })
}

/**
 * 发布流程图版本
 * @param process_model_bpmn_id 流程BPMN ID
 */
export function publishProcessModelBPMN(process_model_bpmn_id: number): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/bpmn/publish`,
    data: { process_model_bpmn_id }
  })
}

/**
 * 发布流程图版本
 * @param process_model_bpmn_id 流程BPMN ID
 */
export function stopProcessModelBPMN(process_model_bpmn_id: number): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/bpmn/stop`,
    data: { process_model_bpmn_id }
  })
}

/**
 * 发起流程
 * @param process_key 流程标识
 * @param params 参数字段列表
 */
export function createProcess(process_key: string, params: Record<string, any>) {
  return request<void>({
    method: 'post',
    url: `/process/create`,
    data: { process_key, params }
  })
}

/***流程相关***/

/**
 * 流程详情
 */
export function processInstanceInfoByProcessKeyAndId(processKey: string, id: number): Promise<ProcessInstanceInfoView> {
  const params = { processKey, id }
  return request<ProcessInstanceInfoView>({
    method: 'get',
    url: `/process/instance/info`,
    params
  })
}

export function completeTask(data: ProcessTaskCompleteParam) {
  return request<ProcessInstanceInfoView>({
    method: 'post',
    url: `/process/task/complete`,
    data
  })
}

/**
 * 获取我的待办任务
 */
export function listTodoTask(): Promise<ProcessTODOTaskView[]> {
  return request<ProcessTODOTaskView[]>({
    method: 'get',
    url: '/process/task/todo/list'
  })
}

/**
 * 获取我的待认领任务
 */
export function listUnclaimTask(): Promise<ProcessTODOTaskView[]> {
  return request<ProcessTODOTaskView[]>({
    method: 'get',
    url: '/process/task/candidate/list'
  })
}

/**
 * 获取我的待办任务
 */
export function listMyHistoryTask(): Promise<ProcessTODOTaskView[]> {
  return request<ProcessTODOTaskView[]>({
    method: 'get',
    url: '/process/task/history/list'
  })
}

/**
 * 获取启动表单
 */
export function getStartFormPage(processKey: string): Promise<ProcessPageInfo> {
  return request<ProcessPageInfo>({
    method: 'get',
    url: `/process/start/form`,
    params: { processKey }
  })
}


/**
 * 绑定启动表单
 */
export function bindStartFormPage(data: BindProcessStartFormParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/process/model/page/start/config`,
    data
  })
}

/**
 * 认领任务
 */
export function claimTask(task_id: string): Promise<void> {
  return request<void>({
    method: 'post',
    url: '/process/task/claim',
    data: { task_id }
  })
}

/**
 * 取消认领任务
 */
export function unclaimTask(task_id: string): Promise<void> {
  return request<void>({
    method: 'post',
    url: '/process/task/unclaim',
    data: { task_id }
  })
}