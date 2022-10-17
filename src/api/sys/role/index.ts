import { request } from "@/api/request";

/**
 * 查询角色
 */
export function findRole() {
  return request<RoleView[]>({
    method: 'get',
    url: `/role/find`,
  })
}

/**
 * 添加角色
 */
export function addRole(data: RoleAddParam) {
  return request<RoleView[]>({
    method: 'post',
    url: `/role/add`,
    data
  })
}

/**
 * 编辑角色
 */
export function updateRole(data: RoleUpdateParam) {
  return request<RoleView[]>({
    method: 'post',
    url: `/role/update`,
    data
  })
}

/**
 * 编辑角色
 * @param {Number} id 角色ID
 * @return {Promise<unknown>}
 */
export function deleteRole(id: string) {
  return request<RoleView[]>({
    method: 'delete',
    url: `/role/${id}`,
  })
}

/**
 * 编辑角色
 * @param {String} ids 角色ID列表
 * @return {Promise<unknown>}
 */
export function batchDelRole(ids: string) {
  return request<RoleView[]>({
    method: 'delete',
    url: `/role/batch/${encodeURIComponent(ids)}`
  })
}

/**
 * 查询角色绑定的菜单
 * @param {number} roleId
 * @returns {Promise<number[]>}
 */
export function menu(roleId: string) {
  return request<string[]>({
    method: 'get',
    url: `/role/menu?roleId=${roleId}`
  })
}

/**
 * 绑定菜单
 */
export function bindMenu(data: RoleMenuBindParam) {
  return request<void>({
    method: 'post',
    url: `/role/menu/bind`,
    data
  })
}
