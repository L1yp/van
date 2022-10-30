import { InjectionKey, Ref } from 'vue';

export const modelingEntityKey = Symbol('modelingEntityKey') as InjectionKey<Ref<ModelingEntityView>>