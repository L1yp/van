

declare type ExecutionListenerEvent = 'start' | 'end' | undefined
declare type ListenerValueType = 'class' | 'expression' | 'delegateExpression'

declare interface ExecutionListenerObject {
  event: ExecutionListenerEvent
  type: ListenerValueType
  value: string
  fields?: ListenerField[]
}

declare type ExecutionListenerFieldType = 'string' | 'expression'
declare interface ListenerField {
  name: string
  type: ExecutionListenerFieldType
  value: string
}

declare type TaskListenerEvent = 'create' | 'assignment' | 'complete' | 'delete'
declare interface TaskListenerObject {
  event?: TaskListenerEvent
  type: ListenerValueType
  value: string
  fields?: ListenerField[]
}


declare interface SelectionChangedEvent {
  newSelection: import('bpmn-js/lib/model/Types').Element[]
}

declare interface ElementChangedEvent {
  element: import('bpmn-js/lib/model/Types').Element
}