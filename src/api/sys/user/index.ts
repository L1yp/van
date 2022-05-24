import axios from "axios";
import {request} from "@/api/request";

export function pageUserList(params: UserQueryParam): Promise<UserView[]> {
  return request<UserView[]>({
    method: 'get',
    url: `/user/page`,
    params
  })
}

export function updateUser(data: UserUpdateParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/update`,
    data
  })
}

export function addUser(data: UserAddParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/add`,
    data
  })
}

/**
 * 查询关联的角色列表
 */
export function findBoundRoles(uid: number): Promise<number[]> {
  return request<number[]>({
    method: 'get',
    url: `/user/role/bound/find?uid=${uid}`,
  })
}

/**
 * 关联角色
 */
export function bindRole(uid: number, role_ids: number[]): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/role/bind`,
    data: { uid, role_ids }
  })
}

/**
 * 查询关联的兼职部门列表
 * @param {Number} uid 用户ID
 * @return Promise<Array<Number>>
 */
export function findBoundPartTimeDepartments(uid: number): Promise<number[]> {
  return request<number[]>({
    method: 'get',
    url: `/user/dept/part-time/bound/find`,
    params: { uid }
  })
}

/**
 * 查询关联主部门
 * @param {Number} uid 用户ID
 * @return Promise<Number>
 */
export function findBoundPrimaryDepartments(uid: number): Promise<number> {
  return request<number>({
    method: 'get',
    url: `/user/dept/primary/bound/find`,
    params: { uid }
  })
}

/**
 * 关联兼职部门
 * @param {Number} uid 用户ID
 * @param {Array} dept_ids 角色列表
 */
export function bindPartTimeDept(uid: number, dept_ids: number[]): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/dept/part-time/bind`,
    data: { uid, dept_ids }
  })
}

/**
 * 关联主部门
 * @param {Number} uid 用户ID
 * @param {Array} primary_dept_id 角色列表
 */
export function bindPrimaryDept(uid: number, primary_dept_id: number): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/dept/primary/bind`,
    data: { uid, primary_dept_id }
  })
}

/**
 * 登录
 * @param {string} username
 * @param {string} password MD5(raw password)
 */
export function login(username: string, password: string): Promise<LoginResult> {
  return request<LoginResult>({
    method: 'post',
    url: `/user/login`,
    data: { username, password }
  })
}

/**
 * 菜单信息
 */
export function menu(): Promise<LoginResult> {
  return request<LoginResult>({
    method: 'get',
    url: `/user/menu`,
  })
}

/**
 * 权限列表
 */
export function permission(): Promise<string[]> {
  return request<string[]>({
    method: 'get',
    url: `/user/permission`,
  })
}