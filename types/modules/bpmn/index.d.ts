declare interface Documentation {
  $type: string;
  text: string;
  $attrs: Record<string, string>
  $parent: any;
  di: any;
}

declare interface BusinessObject {
  $type: string;
  documentation: Documentation[];
  id: string;
  name: string;
  $attrs: Record<string, string>;
  $parent: any;
  di: any;
  initiator?: string
}

declare type ExecutionListenerEvent = 'start' | 'end'
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
  event: TaskListenerEvent
  type: ListenerValueType
  value: string
  fields?: ListenerField[]
}