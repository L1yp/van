import mitt from "mitt";

export type SelectMultipleChangedEvent = {
  prop: string
  multiple: boolean
}

export type FormDesignerFieldDeleteEvent = {
  field: string
}

export type Events = {
  selectMultipleChanged: SelectMultipleChangedEvent
  removeFieldInDesigner: FormDesignerFieldDeleteEvent
}

export default mitt<Events>()