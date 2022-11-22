import {ComputedRef, InjectionKey, Ref, ShallowRef} from "vue";

export const mainWidthKey = Symbol("mainWidthKey") as InjectionKey<ComputedRef<string>>
export const mainHeightKey = Symbol("mainHeight") as InjectionKey<ComputedRef<string>>
export const asideWidthKey = Symbol("asideWidth") as InjectionKey<ComputedRef<string>>
export const asideCollapsedKey = Symbol("asideCollapsed") as InjectionKey<Ref<boolean>>
export const themeKey = Symbol("theme") as InjectionKey<Ref<ThemeConfig>>
export const menuOptionsKey = Symbol("menuOptions") as InjectionKey<Ref<MenuView[]>>
export const userInfoKey = Symbol("userInfo") as InjectionKey<Ref<UserInfo>>
export const dictInfosKey = Symbol("dictInfosKey") as InjectionKey<Ref<DictInfo[]>>
export const dictValuesKey = Symbol("dictValues") as InjectionKey<Ref<DictValue[]>>
export const permissionKey = Symbol("permission") as InjectionKey<Ref<Set<string>>>
export const bpmnSelectedElemKey = Symbol("bpmnSelectedElem") as InjectionKey<ShallowRef<any>>
export const bpmnModelerKey = Symbol("bpmnModeler") as InjectionKey<ShallowRef<any>>
export const updatePropertyKey = Symbol("updatePropertyKey") as InjectionKey<Function>
export const propertyPanelOpenedKey = Symbol("propertyPanelOpenedKey") as InjectionKey<Ref<string>>
export const workflowVerKey = Symbol("workflowVerKey") as InjectionKey<Ref<WorkflowTypeVerView>>
export const modelingFieldKey = Symbol("processModelFieldKey") as InjectionKey<ShallowRef<ModelingFieldDefView[]>>
export const modelingPageKey = Symbol("modelingPageKey") as InjectionKey<ShallowRef<ModelingPageView[]>>
export const processInstanceDetailInfoKey = Symbol("processInstanceDetailInfoKey") as InjectionKey<Ref<ProcessInstanceInfoView>>
export const processNodePageListKey = Symbol("processNodePageListKey") as InjectionKey<ShallowRef<ProcessModelNodePageView[]>>
export const pageFullScreenKey = Symbol("pageFullScreenKey") as InjectionKey<() => void>


export const userMapKey = Symbol('userMapKey') as InjectionKey<Map<string, UserView>>

export const maskContainerKey = Symbol('maskContainerKey') as InjectionKey<Ref<HTMLDivElement | undefined>>


