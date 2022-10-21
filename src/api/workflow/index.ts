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