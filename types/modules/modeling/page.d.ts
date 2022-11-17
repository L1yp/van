declare interface ModelingPageModuleFindParam {
  module: ModelingModule
  mkey: string
}

declare interface ModelingPageFindParam {
  module: ModelingModule
  mkey: string
  name: string
}

declare interface ModelingPageBindParam {
  module: ModelingModule
  mkey: string
  name: string
  page_scheme: VFormScheme
}


declare interface ModelingPageUnbindParam {
  module: ModelingModule
  mkey: string
  name: string
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