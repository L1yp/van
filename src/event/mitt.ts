import mitt from "mitt";

export type SelectMultipleChangedEvent = {
  prop: string
  multiple: boolean
}

export type Events = {
  selectMultipleChanged: SelectMultipleChangedEvent
}

export default mitt<Events>()