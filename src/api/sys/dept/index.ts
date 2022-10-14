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
export function addDept(data: DeptAddParam): Promise<void> {
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
export function updateDept(data: DeptUpdateParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: '/dept/update',
    data
  })
}


/**
 * 删除部门
 */
export function delDept(id: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dept/${id}`,
  })
}