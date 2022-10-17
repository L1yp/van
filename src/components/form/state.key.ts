import {ComputedRef, InjectionKey, Ref} from "vue";
import {FormFieldMode} from "@/components/form/types";

export const formModeKey = Symbol("formModeKey") as InjectionKey<ComputedRef<FormFieldMode>>