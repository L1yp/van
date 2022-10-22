import { request } from '../request'


export function addWorkflowField(data: WorkflowFieldAddParam) {
  return request<void>({
    url: `/workflow/field/add`,
    method: 'POST',
    data,
  })
}


export function updateWorkflowField(data: WorkflowFieldUpdateParam) {
  return request<void>({
    url: `/workflow/field/update`,
    method: 'POST',
    data,
  })
}


export function refWorkflowField(data: WorkflowFieldRefParam) {
  return request<void>({
    url: `/workflow/field/ref`,
    method: 'POST',
    data,
  })
}


export function unrefWorkflowField(data: WorkflowFieldRefParam) {
  return request<void>({
    url: `/workflow/field/unref`,
    method: 'POST',
    data,
  })
}



export function getWorkflowFields(wfKey: string) {
  return request<WorkflowFieldDefView[]>({
    url: `/workflow/field/find`,
    method: 'GET',
    params: { wfKey },
  })
}


export function getScopeFields(scope: FieldScope) {
  return request<WorkflowFieldDefView[]>({
    url: `/workflow/field/find`,
    method: 'GET',
    params: { scope },
  })
}