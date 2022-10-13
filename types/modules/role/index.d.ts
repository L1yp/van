declare interface RoleView {
  id: string;
  name: string;
  order_no: number;
  status: number;
  update_by: string;
}

declare interface RolePageParam extends PageParam {
  name: string
}