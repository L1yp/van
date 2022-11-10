import { request } from '../request'


export function addModelingField(data: ModelingFieldAddParam) {
  return request<void>({
    url: `/modeling/field/add`,
    method: 'POST',
    data,
  })
}


export function updateModelingField(data: ModelingFieldUpdateParam) {
  return request<void>({
    url: `/modeling/field/update`,
    method: 'POST',
    data,
  })
}


export function refModelingField(data: ModelingFieldRefParam) {
  return request<void>({
    url: `/modeling/field/ref`,
    method: 'POST',
    data,
  })
}


export function unrefModelingField(data: ModelingFieldRefParam) {
  return request<void>({
    url: `/modeling/field/unref`,
    method: 'POST',
    data,
  })
}


export function deleteModelingField(id: string) {
  return request<void>({
    url: `/modeling/field/${id}`,
    method: 'DELETE',
  })
}


export function getModelingFields(module: ModelingModule, mkey: string) {
  return request<ModelingFieldDefView[]>({
    url: `/modeling/field/find`,
    method: 'GET',
    params: { module, mkey },
  })
}


export function getScopeFields(scope: FieldScope) {
  return request<ModelingFieldDefView[]>({
    url: `/modeling/field/find`,
    method: 'GET',
    params: { scope },
  })
}


export function getTables() {
  return request<TableScheme[]>({
    url: `/modeling/field/table/list`,
    method: 'GET',
  })
}

export function getTableColumns(tableName: string) {
  return request<TableScheme[]>({
    url: `/modeling/field/table/column/list`,
    method: 'GET',
    params: { tableName },
  })
}