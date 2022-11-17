declare interface ModelingPageFindParam {
  module: ModelingModule
  mkey: string
  pageKey: string
}

declare interface ModelingPageBindParam {
  page_key: string
  page_id: string
}

declare interface ModelingPageUnbindParam {
  page_key: string
  page_id: string
}

declare interface ModelingPageAddParam {
  module: ModelingModule
  mkey: string
  name: string
  page_scheme: VFormScheme
}

declare interface ModelingPageAddAndBindParam {
  module: ModelingModule
  mkey: string
  name: string
  page_id: string
  page_key: string
  page_scheme: VFormScheme
}

declare interface ModelingPageUpdateParam {
  id: string
  name: string
  page_scheme: VFormScheme
}

declare interface ModelingPageView {
  id: string
  module: ModelingModule
  mkey: string
  name: string
  page_scheme: VFormScheme
  update_by: string
  update_time: string
  create_by: string
  create_time: string
}