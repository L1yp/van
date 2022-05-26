declare interface AddProcessModelPageParam {
  process_key: string
  name: string
  remark: string
}


declare interface AddProcessModelPageSchemeParam {
  process_model_page_id: number
  h5: PageFieldScheme[]
  pad: PageFieldScheme[]
  pc: PageFieldScheme[]
}

declare interface PageFieldScheme {
  id?: number
  process_model_page_id: number
  field: ProcessFieldDefinition
  field_id: number
  field_name: string
  field_label: string
  order_no: number
  span: number
  writeable: number
  value?: any
}

declare interface ProcessModelPageView {
  id: number
  process_key: string
  name: string
  remark: string
  update_by: string
}

declare interface ProcessModelPageSchemeView {
  h5: PageFieldScheme[]
  pad: PageFieldScheme[]
  pc: PageFieldScheme[]
}

declare interface ProcessModelNodePageView {
  id: number
  process_key: string
  process_bpmn_id: number
  process_model_page_id: number
  node_id: string
  page_width: string
  label_width: string
  comment: number
  update_by: string
  update_time: string
  create_time: string
}

declare interface BindProcessModelNodePageParam {
  process_key: string
  process_bpmn_id: number
  process_model_page_id: number
  node_id: string
  page_width: string
  label_width: string
  comment: number
}

declare interface BindProcessStartFormParam {
  process_key: string
  process_model_page_id: number
  page_width: string
  label_width: string
}