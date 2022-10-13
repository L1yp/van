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
  hidden: number;
  pid: number;
  children?: MenuConfig[];
  has_children?: boolean;
  parent?: MenuConfig;
}



declare interface MenuAddParam {
  name: string
  pid: string
  type: 'FOLDER' | 'PAGE' | 'BUTTON' | 'TAB' | 'PROCESS'
  path: string
  component: string
  icon: string
  order_no: number
  hidden: boolean
  closeable: boolean
  state: number
  remark: string
}

declare interface MenuUpdateParam {
  id: string
  name: string
  pid: string
  type: 'FOLDER' | 'PAGE' | 'BUTTON' | 'TAB' | 'PROCESS'
  path: string
  component: string
  icon: string
  order_no: number
  hidden: boolean
  closeable: boolean
  state: number
  remark: string
}