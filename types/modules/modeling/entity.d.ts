declare interface ModelingEntityFindParam extends PageParam {
  mkey: string
  name: string
  remark: string
  updateBy: string
  createBy: string
}

declare interface ModelingEntityAddParam {
  mkey: string
  name: string
  remark: string
}

declare interface ModelingEntityUpdateParam {
  id: string
  name: string
  remark: string
  status: number
}

declare interface ModelingEntityView {
  id: string
  mkey: string
  name: string
  remark: string
  status: number
  update_by: string
  create_by: string
  update_time: string
  create_time: string
}


// INSTANCE

declare interface ModelingEntityInstanceAddParam {
  mkey: string
  data: Record<string, any>
}

declare interface ModelingEntityInstanceUpdateParam {
  mkey: string
  id: string
  data: Record<string, any>
}

declare interface ModelingEntityInstanceFindParam {
  module: ModelingModule
  mkey: string
  id: string
}

declare interface ModelingEntityInstanceDeleteParam {
  mkey: string
  id: string
}
