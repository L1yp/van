import { request } from '../request'


export function getPermissionContent(params: ModelingPermissionFindParam) {
  return request<ModelingPermissionView>({
    url: `/modeling/permission/find`,
    method: 'GET',
    params
  })
}

export function bindPermission(data: ModelingPermissionBindParam) {
  return request<void>({
    url: `/modeling/permission/bind`,
    method: 'POST',
    data
  })
}