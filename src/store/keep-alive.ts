import { defineStore } from "pinia";

export const useKeepAliveStore = defineStore('keep-alve', {
  state: () => ({
    keepAliveNames: [] as string[],
    refreshComponent: true,
  }),
  actions: {
    init(names: string[]) {
      this.keepAliveNames = names
    },
    removeComponentName(name: string) {
      const idx = this.keepAliveNames.indexOf(name)
      idx !== -1 && this.keepAliveNames.splice(idx, 1)
    },
    addComponentName(name: string) {
      this.keepAliveNames.push(name)
    }
  },
})