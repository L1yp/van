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
  assistant?: string;
  assistant_info?: UserView;
  status?: number;
}

declare interface DeptAddParam {
  title: string;
  simple_name: string;
  description?: string;
  ident: string;
  order_no: number;
  pid: string;
  owner: string;
  assistant: string;
  status: number;
}

declare interface DeptUpdateParam {
  id: string;
  title?: string;
  simple_name?: string;
  description?: string;
  ident?: string;
  order_no?: number;
  pid?: string;
  owner?: string;
  assistant: string;
  status?: number;
}
