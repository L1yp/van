import axios from "axios";
import {request} from "@/api/request";

/**
 * 获取部门列表
 */
export function findDept(): Promise<DeptView[]> {
  return request<DeptView[]>({
    method: 'get',
    url: '/dept/find'
  })
}

/**
 * 搜索部门列表
 */
export function searchDept(keyword: string): Promise<DeptView[]> {
  const params = { keyword }
  return request<DeptView[]>({
    method: 'get',
    url: '/dept/search',
    params
  })
}

/**
 * 添加部门
 * @return {Promise<void>}
 */
export function addDept(data: AddDeptParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: '/dept/add',
    data
  })
}


/**
 * 更新部门
 * @return {Promise<Object>}
 */
export function updateDept(data: UpdateDeptParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: '/dept/update',
    data
  })
}


/**
 * 删除角色
 * @param {Number} id 角色ID
 * @return {Promise<Object>}
 */
export function delDept(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dept/${id}`,
  })
}