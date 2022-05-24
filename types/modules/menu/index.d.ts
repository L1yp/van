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
