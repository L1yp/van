import axios from "axios";
import {request} from "@/api/request";

/**
 * 查询角色
 */
export function findRole(): Promise<RoleView[]> {
  return request<RoleView[]>({
    method: 'get',
    url: `/role/find`
  })
}

/**
 * 添加角色
 * @param name 角色名称
 * @param order_no 角色排序
 */
export function addRole(name: string, order_no: number) {
  const data = {name, order_no};
  return request<RoleView[]>({
    method: 'post',
    url: `/role/add`,
    data
  })
}

/**
 * 编辑角色
 * @param {Number} id 角色ID
 * @param {String} name 角色名称
 * @param {Number} order_no 角色排序
 * @return {Promise<unknown>}
 */
export function editRole(id: number, name: string, order_no: number) {
  const data = {id, name, order_no};
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
export function delRole(id: number) {
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
export function menuBound(roleId: number): Promise<number[]> {
  return request<number[]>({
    method: 'get',
    url: `/role/menu/bound?roleId=${roleId}`
  })
}

/**
 * 绑定菜单
 * @param {number} role_id
 * @param {number[]} menu_ids
 */
export function bindMenu(role_id: number, menu_ids: number[]): Promise<void> {
  const data = { role_id, menu_ids }
  return request<void>({
    method: 'post',
    url: `/role/menu/bind`,
    data
  })
}


/**
 * 查询角色绑定的权限列表
 * @param {number} roleId
 * @returns {Promise<number[]>}
 */
export function permissionBound(roleId: number): Promise<number[]> {
  return request<number[]>({
    method: 'get',
    url: `/role/permission/bound?roleId=${roleId}`,
  })
}

/**
 * 绑定菜单
 * @param {number} role_id
 * @param {number[]} permission_ids
 */
export function bindPermission(role_id: number, permission_ids: number[]) {
  return request<void>({
    method: 'post',
    url: `/role/permission/bind`,
    data: { role_id, permission_ids }
  })
}