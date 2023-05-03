import { defineStore } from "pinia";
import { getDeviceType } from "@/utils/common";
import { useThemeStore } from "@/store/theme";
import { TagInfo } from "@/layouts/components/tag";
import { computed } from "vue";

const deviceType = getDeviceType()

export const formLabelPosition = computed(() => deviceType.value === 'h5' ? 'top' : 'right')

let startIndex = 1000
function incPageFullScreenZIndex() {
  return ++startIndex
}

const theme = useThemeStore()

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
        return '0px'
      }
      return this.asideOpened ? `${theme.asideWidth}px` : '64px'
    },
    mainWidth(state): string {
      return state.pageScreen ? '100vw' : `calc(100vw - ${this.asideWidth})`
    },
    mainHeight(state): string {
      return state.pageScreen ? '100dvh' : `calc(100dvh - ${theme.headerHeight + theme.tagBarHeight + theme.footerHeight}px)`
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