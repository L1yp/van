import { request } from '../request'

export function pageWorkflowDef(params: WorkflowTypeDefPageParam) {
  return request<PageData<WorkflowTypeDefView>>({
    url: '/workflow/type/def/page',
    method: 'GET',
    params
  })
}