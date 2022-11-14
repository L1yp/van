import mitt from "mitt";

export type SelectMultipleChangedEvent = {
  prop: string
  multiple: boolean
}

export type FormDesignerFieldDeleteEvent = {
  field: string
}

export type ElementChanged = {
  element: any
}

export type Events = {
  selectMultipleChanged: SelectMultipleChangedEvent
  removeFieldInDesigner: FormDesignerFieldDeleteEvent
  elementChanged: ElementChanged
}

export default mitt<Events>()