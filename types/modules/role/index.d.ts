declare interface RoleView {
  id: string;
  name: string;
  order_no: number;
  status: number;
  update_by: string;
}

declare interface RoleAddParam {
  name: string
  order_no: number
}

declare interface RoleUpdateParam extends RoleAddParam {
  id: string
}

declare interface RoleMenuBindParam {
  role_id: string
  menu_ids: string[]
}