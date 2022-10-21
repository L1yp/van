import { InjectionKey, Ref } from 'vue';

export const workflowDefKey = Symbol('workflowDefKey') as InjectionKey<Ref<WorkflowTypeDefView>>