declare interface TreeData {
  children?: TreeData[];
  [propKey: string]: any;
}


declare interface MenuConfig extends TreeData{
  id: number;
  title: string;
  name: string;
  route: string;
  icon: string;
  close: number;
  pid: number;
  children?: MenuConfig[];
  has_children?: boolean;
  parent?: MenuConfig;
}

declare type MenuType = 'FOLDER' | 'PAGE' | 'BUTTON' | 'TAB' | 'PROCESS'

declare interface MenuAddParam {
  name: string
  pid: string
  type: MenuType
  path: string
  component: string
  icon: string
  order_no: number
  closeable: boolean
  state: number
  remark: string
}

declare interface MenuUpdateParam {
  id: string
  name: string
  pid: string
  type: MenuType
  path: string
  component: string
  icon: string
  order_no: number
  closeable: boolean
  state: number
  remark: string
}