import { defineStore } from "pinia";
import { useDark } from "@vueuse/core";

const dark = useDark()

export const useThemeStore = defineStore('theme', {
  state: () => ({
    asideWidth: 200,
    headerHeight: 60,
    footerHeight: 0,
    mainPadding: 20,
    footerPadding: 0,
    tagBarHeight: 30,
    dark,
  }),
  getters: {
    AGGridClass(state) {
      return state.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
    },
  },
})