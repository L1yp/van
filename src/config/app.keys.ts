import {ComputedRef, InjectionKey, Ref, ShallowRef} from "vue";

const mainWidthKey = Symbol("mainWidthKey") as InjectionKey<ComputedRef<string>>
const mainHeightKey = Symbol("mainHeight") as InjectionKey<ComputedRef<string>>
const asideWidthKey = Symbol("asideWidth") as InjectionKey<ComputedRef<string>>
const asideCollapsedKey = Symbol("asideCollapsed") as InjectionKey<Ref<boolean>>
const themeKey = Symbol("theme") as InjectionKey<Ref<ThemeConfig>>
const menuOptionsKey = Symbol("menuOptions") as InjectionKey<Ref<MenuConfig[]>>
const userInfoKey = Symbol("userInfo") as InjectionKey<Ref<UserInfo>>
const dictInfosKey = Symbol("dictInfosKey") as InjectionKey<Ref<DictInfo[]>>
const dictValuesKey = Symbol("dictValues") as InjectionKey<Ref<DictValue[]>>
const permissionKey = Symbol("permission") as InjectionKey<Ref<Set<string>>>
const bpmnSelectedElemKey = Symbol("bpmnSelectedElem") as InjectionKey<ShallowRef<any>>
const bpmnModelerKey = Symbol("bpmnModeler") as InjectionKey<ShallowRef<any>>
const updatePropertyKey = Symbol("updatePropertyKey") as InjectionKey<Function>
const propertyPanelOpenKey = Symbol("propertyPanelOpenKey") as InjectionKey<Function>
const processModelFieldKey = Symbol("processModelFieldKey") as InjectionKey<ShallowRef<ProcessFieldDefinition[]>>
const processInstanceDetailInfoKey = Symbol("processInstanceDetailInfoKey") as InjectionKey<Ref<ProcessInstanceInfoView>>
const processNodePageListKey = Symbol("processNodePageListKey") as InjectionKey<ShallowRef<ProcessModelNodePageView[]>>
const pageFullScreenKey = Symbol("pageFullScreenKey") as InjectionKey<Ref<boolean>>




export {
  mainWidthKey,
  mainHeightKey,
  asideWidthKey,
  asideCollapsedKey,
  themeKey,
  menuOptionsKey,
  dictInfosKey,
  dictValuesKey,
  permissionKey,
  userInfoKey,
  bpmnSelectedElemKey,
  bpmnModelerKey,
  updatePropertyKey,
  propertyPanelOpenKey,
  processModelFieldKey,
  processInstanceDetailInfoKey,
  processNodePageListKey,
  pageFullScreenKey,
}
