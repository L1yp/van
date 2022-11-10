declare interface ModelingPageFindParam {
  module: ModelingModule
  mkey: string
  pageKey: string
}

declare interface ModelingPageBindParam {
  module: ModelingModule
  mkey: string
  page_key: string
  page_scheme: VFormScheme
}


declare interface ModelingPageUnbindParam {
  module: ModelingModule
  mkey: string
  pageKey: string
}

declare interface ModelingPageView {
  id: string
  module: ModelingModule
  mkey: string
  page_key: string
  page_scheme: VFormScheme
  update_by: string
  update_time: string
  create_by: string
  create_time: string
}