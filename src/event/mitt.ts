import mitt from "mitt";
import {Base} from "bpmn-js";

export type SelectMultipleChangedEvent = {
  prop: string
  multiple: boolean
}

export type FormDesignerFieldDeleteEvent = {
  field: string
}

export type BpmnElementChanged = {
  element: Base
}


export type BpmnSelectionChanged = {
  element: any
}

export type Events = {
  selectMultipleChanged: SelectMultipleChangedEvent
  removeFieldInDesigner: FormDesignerFieldDeleteEvent
  bpmnElementChanged: BpmnElementChanged
  bpmnSelectionChanged: BpmnSelectionChanged
}

export default mitt<Events>()