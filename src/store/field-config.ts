import {defineStore} from "pinia";

export const useFieldStore = defineStore('field-config-store', {
  state: () => ({
    scope: 'GLOBAL' as FieldScope,
    module: 'WORKFLOW' as ModelingModule,
    mkey: '',
  }),
  getters: {}
})