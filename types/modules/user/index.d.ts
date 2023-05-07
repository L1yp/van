declare interface LoginParam {
  username: string;
  password: string;
}




/**
 * 由于GET的参数反序列化是 springmvc 直接处理，因此 参数命名是驼峰
 * POST body是jackson反序列化，配置了下划线风格
 */
declare interface UserQueryParam extends PageParam {
  username?: string
  nickname?: string
  phone?: string
  email?: string
  deptId?: string
  status?: number
  updateBy?: string
}

declare interface UserAddParam {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  dept_id: string
  status?: number;
}

declare interface UserUpdateParam {
  id: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  dept_id: string
  pt_dept_ids: string[]
  role_ids: string[],
  status?: number;
}

declare interface UserView {
  id: string
  username: string;
  dept_id: number
  nickname: string;
  phone: string;
  email: string;
  avatar: string;
  status: number;
  update_by: string;
  label: string;
  pt_dept_ids: string[]
  role_ids: string[]
}

declare interface UserPageAdditional {
  dept: Record<string, DeptView>
}