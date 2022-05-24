declare interface DeptView {
  id: number;
  title: string;
  simple_name: string;
  description: string;
  ident: string;
  order_no: number;
  pid: number;
  owner: number;
  owner_info?: UserView;
  status: boolean;
  children: DeptView[],
}

declare interface AddDeptParam {
  title: string;
  simple_name: string;
  description?: string;
  ident: string;
  order_no: number;
  pid: number;
  owner: number;
  status: boolean;
}

declare interface UpdateDeptParam {
  id: number;
  title?: string;
  simple_name?: string;
  description?: string;
  ident?: string;
  order_no?: number;
  pid?: number;
  owner?: number;
  status?: boolean;
}
