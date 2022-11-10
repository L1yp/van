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

// 新增实体实例
export function createInstance(data: ModelingEntityInstanceAddParam) {
  return request<void>({
    url: `/modeling/entity/instance/create`,
    method: 'POST',
    data
  })
}

// 更新实体实例
export function updateInstance(data: ModelingEntityInstanceUpdateParam) {
  return request<void>({
    url: `/modeling/entity/instance/update`,
    method: 'POST',
    data
  })
}

// 删除实体实例
export function deleteInstance(data: ModelingEntityInstanceDeleteParam) {
  return request<void>({
    url: `/modeling/entity/instance`,
    method: 'DELETE',
    data
  })
}

// 查询实体实例
export function getInstance(params: ModelingEntityInstanceFindParam) {
  return request<Record<string, any>>({
    url: `/modeling/entity/instance`,
    method: 'GET',
    params
  })
}