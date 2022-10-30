declare type TableAlign = 'left' | 'center' | 'right'
declare type OrderDirection = 'asc' | 'desc'

declare interface ModelingViewSearchParam {
  module: FieldModule
  mkey: string
  name?: string
  updateBy?: string
  createBy?: string
}

declare interface ModelingViewFindParam {
  module: FieldModule
  mkey: string
}

declare interface Collation {
  /**
   * v-for配置的
   */
  id?: number
  /**
   * 列名
   */
  field: string

  order: OrderDirection
}


declare interface ModelingViewColumnParam {
  field_id: string
  field: ModelingFieldDefView
  width: number
  align: TableAlign
  filterable: boolean
  sortable: boolean
  resizable: boolean
  condition: string
}

declare interface ModelingViewAddParam {
  module: FieldModule
  mkey: string
  name: string
  collation: Collation[]
  sn: number
  status: boolean
  columns: ModelingViewColumnParam[]
}

declare interface ModelingViewUpdateParam {
  id: string
  name: string
  collation: Collation[]
  sn: number
  status: boolean
  columns: ModelingViewColumnParam[]
}

declare interface ModelingViewView {
  id: string
  module: FieldModule
  mkey: string
  name: string
  collation: Collation[]
  sn: number
  status: boolean
  update_by: string
  update_time: string
  create_by: string
  create_time: string
  columns: ModelingViewColumnView[]
}

declare interface ModelingViewColumnView {
  id: string
  view_id: string
  field: ModelingFieldDefView
  field_id: string
  width: number
  align: TableAlign
  filterable: boolean
  sortable: boolean
  resizable: boolean
  condition: string
  update_by: string
  update_time: string
  create_by: string
  create_time: string
}

declare interface ModelingViewSimpleInfo {
  id: string
  name: string
  sn: number
  collation: Collation[]
  columns: ModelingViewColumnView[]
}


declare interface ModelingViewDetailInfo {
  id: string
  module: FieldModule
  mkey: string
  name: string
  collation: Collation[]
  sn: number
  status: boolean
  update_by: UserView
  update_time: string
  create_by: UserView
  create_time: string
  columns: ModelingViewColumnView[]
}

declare interface ModelingPageFindParam {
  module: FieldModule
  mkey: string
  condition_map: Record<string, any>
  collation?: Collation[]
  page_idx: number
  page_size: number
}