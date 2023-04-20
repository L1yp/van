import { defineStore } from "pinia";
import { getDeviceType } from "@/utils/common";
import { useThemeStore } from "@/store/theme";
import { TagInfo } from "@/layouts/components/tag";


const deviceType = getDeviceType()
const theme = useThemeStore()

let startIndex = 1000
function incPageFullScreenZIndex() {
  return ++startIndex
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    pageScreen: false,
    /**
     * @type HTMLDivElement
     */
    maskContainerRef: null as HTMLDivElement | null,
    asideOpened: deviceType.value !== 'h5',
  }),
  getters: {
    asideWidth(state): string {
      if (deviceType.value === 'h5') {
        return '0'
      }
      return this.asideOpened ? `${theme.asideWidth}px` : '64px'
    },
    mainWidth(state): string {
      return state.pageScreen ? '100vw' : `calc(100vw - ${this.asideWidth})`
    },
    mainHeight(state): string {
      return state.pageScreen ? '100vh' : `calc(100vh - ${theme.headerHeight + theme.tagBarHeight + theme.footerHeight}px)`
    }
  },
  actions: {
    incrementZIndex(): number {
      return incPageFullScreenZIndex()
    },
    setPageFullScreen() {
      this.incrementZIndex()
      this.pageScreen = true
    }
  },
})


export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [] as TagInfo[],
    activeTag: null as TagInfo | null,
  }),

})