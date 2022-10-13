declare interface DeptView extends Tree {
  id: string;
  title?: string;
  simple_name?: string;
  description?: string;
  ident?: string;
  order_no?: number;
  pid?: string;
  owner?: string;
  owner_info?: UserView;
  status?: boolean;
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
