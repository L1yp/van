import {ComputedRef, InjectionKey, Ref} from "vue";

export const formModeKey = Symbol("formModeKey") as InjectionKey<ComputedRef<FormFieldMode>>

export const formDataKey = Symbol('formDataKey') as InjectionKey<Ref<object>>

export const vFormActiveElementKey = Symbol('vFormActiveElementKey') as InjectionKey<Ref<ComponentConfig | null>>
export const vFormSchemeKey = Symbol('vFormSchemeKey') as InjectionKey<Ref<VFormScheme>>