import {defineStore} from "pinia";
import {useDark} from "@vueuse/core";

const dark = useDark()
export const useSystemStore = defineStore('system-store', {
  state: () => ({
    dark,
  }),
})