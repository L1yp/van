declare type TableAlign = 'left' | 'center' | 'right'
declare type OrderDirection = 'asc' | 'desc'

declare interface ModelingViewSearchParam {
  module: ModelingModule
  mkey: string
  name?: string
  updateBy?: string
  createBy?: string
}

declare interface ModelingViewFindParam {
  module: ModelingModule
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
  id?: string
  field_id: string
  field: ModelingFieldDefView
  width: number
  min_width: number
  align: TableAlign
  filterable: boolean
  sortable: boolean
  resizable: boolean
  condition: string
}

declare interface ModelingViewAddParam {
  module: ModelingModule
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
  module: ModelingModule
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
  min_width: number
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
  status: boolean
  collation: Collation[]
  columns: ModelingViewColumnView[]
}


declare interface ModelingViewDetailInfo extends ModelingViewSimpleInfo {
  module: ModelingModule
  mkey: string
  update_by: UserView
  update_time: string
  create_by: UserView
  create_time: string
}

declare interface ModelingInstancePageFindParam {
  module: ModelingModule
  mkey: string
  condition_map: Record<string, any>
  collation?: Collation[]
  page_idx: number
  page_size: number
}