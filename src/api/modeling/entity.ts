import { request } from '../request'

export function findModelingEntity(id: string) {
  return request<ModelingEntityView>({
    url: `/modeling/entity/find/${id}`,
    method: 'GET',
  })
}

export function searchModelingEntity(params: Partial<ModelingEntityFindParam>) {
  return request<PageData<ModelingEntityView, Map<string, UserView>>>({
    url: `/modeling/entity/search`,
    method: 'GET',
    params,
  })
}

export function addModelingEntity(data: ModelingEntityAddParam) {
  return request<void>({
    url: `/modeling/entity/add`,
    method: 'POST',
    data,
  })
}

export function updateModelingEntity(data: ModelingEntityUpdateParam) {
  return request<void>({
    url: `/modeling/entity/update`,
    method: 'POST',
    data,
  })
}

export function deleteModelingEntity(id: string) {
  return request<void>({
    url: `/modeling/entity/${id}`,
    method: 'DELETE',
  })
}

