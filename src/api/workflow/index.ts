import { request } from '../request'

export function pageWorkflowDef(params: WorkflowTypeDefPageParam) {
  return request<PageData<WorkflowTypeDefView>>({
    url: '/workflow/type/def/page',
    method: 'GET',
    params
  })
}

export function findById(id: string) {
  return request<WorkflowTypeDefView>({
    url: `/workflow/type/def/${id}`,
    method: 'GET',
  })
}

export function updateWorkflowDef(data: WorkflowTypeDefUpdateParam) {
  return request<void>({
    url: `/workflow/type/def/update`,
    method: 'POST',
    data,
  })
}

export function addWorkflowDef(data: WorkflowTypeDefAddParam) {
  return request<void>({
    url: `/workflow/type/def/add`,
    method: 'POST',
    data,
  })
}



export function findVerById(id: string) {
  return request<WorkflowTypeVerView>({
    url: `/workflow/type/ver/find`,
    method: 'GET',
    params: { id },
  })
}



export function updateXml(data: WorkflowTypeVerUpdateXmlParam) {
  return request<void>({
    url: `/workflow/type/ver/updateXml`,
    method: 'POST',
    data,
  })
}

export function activeVer(data: WorkflowTypeVerActiveParam) {
  return request<void>({
    url: `/workflow/type/ver/active`,
    method: 'POST',
    data,
  })
}


export function pendingVer(data: WorkflowTypeVerPendingParam) {
  return request<void>({
    url: `/workflow/type/ver/pending`,
    method: 'POST',
    data,
  })
}


/** 流程实例操作API */

/** 启动流程 */
export function startInstance(data: WorkflowInstanceStartParam) {
  return request<WorkflowInstanceCreateResult>({
    url: `/workflow/engine/instance/start`,
    method: 'POST',
    data,
  })
}

/** 获取启动表单 */
export function getStartForm(mkey: string) {
  return request<ModelingPageView>({
    url: `/workflow/engine/instance/getStartForm`,
    method: 'GET',
    params: { mkey },
  })
}