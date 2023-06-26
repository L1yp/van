import { inject, InjectionKey, Ref, ShallowRef } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";

export const menuOptionsKey = Symbol("menuOptions") as InjectionKey<Ref<MenuView[]>>

export const userInfoKey = Symbol("userInfo") as InjectionKey<Ref<UserInfo>>

export const userMapKey = Symbol('userMapKey') as InjectionKey<Map<string, UserView>>

export const permissionKey = Symbol("permission") as InjectionKey<Ref<Set<string>>>
export const bpmnSelectedElemKey = Symbol("bpmnSelectedElem") as InjectionKey<ShallowRef<any>>
export const bpmnModelerKey = Symbol("bpmnModeler") as InjectionKey<ShallowRef<BpmnModeler | undefined>>
export const updatePropertyKey = Symbol("updatePropertyKey") as InjectionKey<Function>
export const propertyPanelOpenedKey = Symbol("propertyPanelOpenedKey") as InjectionKey<Ref<string>>
export const workflowVerKey = Symbol("workflowVerKey") as InjectionKey<Ref<WorkflowTypeVerView | undefined>>
export const modelingFieldKey = Symbol("processModelFieldKey") as InjectionKey<ShallowRef<ModelingFieldDefView[]>>
export const modelingPageKey = Symbol("modelingPageKey") as InjectionKey<ShallowRef<ModelingPageView[]>>
export const processInstanceDetailInfoKey = Symbol("processInstanceDetailInfoKey") as InjectionKey<Ref<ProcessInstanceInfoView>>
export const processNodePageListKey = Symbol("processNodePageListKey") as InjectionKey<ShallowRef<ProcessModelNodePageView[]>>




