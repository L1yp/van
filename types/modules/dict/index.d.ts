declare interface DictInfo {
  id?: number;
  name?: string;
  scope?: string;
  ident?: string;
  status?: number;
  type?: number;
  remark?: string;
  create_time?: number;
}

declare interface DictValue {
  id: number;
  scope: string;
  ident: string;
  label: string;
  val: number;
  order_no: number;
  status: number;
  pid: number;
  meta: string;
  metaObj?:DictMeta
  remark: string;
  create_time?: number;
  children?: DictValue[];
  value?: number; /* 用于 el-tree，等于val */
}

declare type TagType = 'success' | 'info' | 'warning' | 'danger'
declare type TagEffect = 'dark' | 'light' | 'plain'
declare type TagSize = 'large' | 'default' | 'small'

declare interface DictMeta {
// {"type":"success","effect":"light","size":"default"}
  type: TagType
  effect: TagEffect
  size: TagSize
  color: string
  hit: boolean
  disableTransitions: boolean
  round: boolean
  [key: string]: any
}