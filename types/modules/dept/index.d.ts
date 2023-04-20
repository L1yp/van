declare interface DeptView extends Tree {
  id: string;
  title: string;
  simple_name: string;
  description: string;
  ident: string;
  order_no: number;
  pid: string;
  owner: string;
  owner_info: UserView;
  assistant: string;
  assistant_info: UserView;
  status: number;
}

declare type DeptAddParam = Omit<DeptView, 'children' | 'id' | 'owner_info' | 'assistant_info'>
declare type DeptUpdateParam = Omit<DeptView, 'children' | 'owner_info' | 'assistant_info'>
