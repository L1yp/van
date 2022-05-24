import axios from "axios";
import {request} from "@/api/request";

/**
 * 查询权限列表
 */
export function findAll(): Promise<PermissionView[]> {
  return request<PermissionView[]>({
    method: 'get',
    url: `/permission/find`,
  })
}

/**
 * 添加权限
 */
export function addPermission(data): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/permission/add`,
    data
  })
}

/**
 * 编辑权限
 */
export function updatePermission(data): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/permission/update`,
    data
  })
}

/**
 * 删除权限
 * @param {Number} id 权限ID
 * @return {Promise<unknown>}
 */
export function delPermission(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/permission/${id}`,
  })
}

/**
 * 编辑角色
 * @param {String} ids 角色ID列表
 * @return {Promise<string>}
 */
export function batchDelPermission(ids: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/permission/batch/${encodeURIComponent(ids)}`,
  })
}