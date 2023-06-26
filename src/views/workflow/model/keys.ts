import { inject, InjectionKey, Ref } from 'vue';

export const workflowDefKey = Symbol('workflowDefKey') as InjectionKey<Ref<WorkflowTypeDefView | WorkflowTypeVerView | undefined>>

export function useWorkflowDef() {
  return inject(workflowDefKey)!
}