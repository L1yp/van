declare interface LoginParam {
  username: string;
  password: string;
}

declare interface LoginResult {
  menus: MenuConfig[];
  user_info: UserInfo;
  token: string;
}


/**
 * 由于GET的参数反序列化是 springmvc 直接处理，因此 参数命名是驼峰
 * POST body是jackson反序列化，配置了下划线风格
 */
declare interface UserQueryParam extends PageParam {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  status?: number;
  updateBy?: string;
}

declare interface UserAddParam {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  status?: number;
}

declare interface UserUpdateParam {
  id: number;
  password?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  status?: number;
}

declare interface UserView {
  id: number;
  username: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  status?: number;
  update_by?: string;
  label?: string;
}
