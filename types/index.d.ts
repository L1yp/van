declare interface PageParam {
  pageIdx: number;
  pageSize: number;
}

declare interface UserInfo {
  username: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
}

declare interface TableData<T> {
  data: T[]
  height: string | number | import("vue").ComputedRef<string | number>
  loading: boolean
}

declare interface PageTableData<T> {
  pageIdx: number
  pageSize: number
  total: number
  tableData: TableData<T>
}

declare interface DialogInfo<T> {
  visible: boolean
  formData: T
  title: string
  loading: boolean
}