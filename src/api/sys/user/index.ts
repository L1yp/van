import { request } from "@/api/request";

export function pageUserList(params: UserQueryParam): Promise<PageData<UserView>> {
  return request<PageData<UserView>>({
    method: 'get',
    url: `/user/page`,
    params
  })
}

export function searchUserList(key: string) {
  return request<UserView[]>({
    method: 'get',
    url: `/user/search`,
    params: { key },
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
export function findBoundRoles(uid: string): Promise<string[]> {
  return request<string[]>({
    method: 'get',
    url: `/user/role`,
    params: { uid }
  })
}

/**
 * 关联角色
 */
export function bindRole(uid: number, role_ids: number[]): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/user/role/bind`,
    data: {uid, role_ids}
  })
}

/**
 * 查询关联的兼职部门列表
 * @return Promise<string[]>
 */
export function findPartTimeDept(): Promise<string[]> {
  return request<string[]>({
    method: 'get',
    url: `/user/pt/dept`
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
    data: {username, password}
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

/**
 * 权限列表
 */
 export function listByIdList(id_list: string[]) {
  return request<UserView[]>({
    method: 'get',
    url: `/user/list/${id_list.join(',')}`,
  })
}