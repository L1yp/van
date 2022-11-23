<template>
  <el-container>
    <el-aside :width="asideWidth" :style="pageScreen ? { display: 'none' } : undefined">
      <aside-bar></aside-bar>
    </el-aside>
    <el-container>
      <el-header :style="pageScreen ? { display: 'none' } : undefined">
        <header-bar/>
      </el-header>
      <tag-bar :style="pageScreen ? { display: 'none' } : undefined"/>
      <el-main style="position: relative" :style="{ width: mainWidth, height: mainHeight }">
        <router-view>
          <template #default="{ Component, route }">
            <transition name="fade" mode="out-in" appear>
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </template>
        </router-view>
        <div
          v-show="pageScreen"
          class="close-page-full-screen"
          title="关闭全屏"
          @click.stop="pageScreen = false"
          :style="{ 'z-index': pageScreenZIndex }"
        >
          <s-v-g-icon class="close-icon" name="close" style="width: 16px; height: 16px; position: absolute; left: 10px; top: 4px"></s-v-g-icon>
        </div>
        <div ref="maskContainerRef" style="position: absolute; top: 0; left: 0; "></div>
      </el-main>
      <el-footer :style="pageScreen ? { display: 'none' } : undefined"></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, provide, Ref, ref } from "vue"
import { ElContainer, ElHeader, ElAside, ElMain, ElFooter, ElScrollbar, ElIcon } from "element-plus"
import Theme from "../config/theme"
import {HeaderBar} from "./components/header"
import {AsideBar} from "./components/aside"
import {TagBar} from "./components/tag"
import {RouterView} from "vue-router"
import {
  mainHeightKey,
  asideWidthKey,
  asideCollapsedKey,
  themeKey, mainWidthKey, pageFullScreenKey, maskContainerKey,
} from "@/config/app.keys"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {incMaskZIndex} from "@/components/dialog/mask";


const asideCollapsed: Ref<boolean> = ref(false);
provide(asideCollapsedKey, asideCollapsed);

const asideWidth = computed<string>(() => {
  return asideCollapsed.value ? "64px" : `${theme.value.asideWidth}px`;
})
provide(asideWidthKey, asideWidth);

const theme = ref<ThemeConfig>(Theme)
provide(themeKey, theme)

const mainWidth = computed<string>(() => {
  if (pageScreen.value) {
    return'100vw'
  }
  return `calc(100vw - ${asideWidth.value})`;
})
provide(mainWidthKey, mainWidth);

const mainHeight = computed<string>(() => {
  if (pageScreen.value) {
    return '100vh'
  }
  return `calc(100vh - ${theme.value.headerHeight + theme.value.tagBarHeight+ theme.value.footerHeight}px)`;
})
provide(mainHeightKey, mainHeight);


const headerHeight = computed(() => `${theme.value.headerHeight}px`)
const footerHeight = computed(() => `${theme.value.footerHeight}px`)
const mainPadding = computed(() => `${theme.value.mainPadding}px`)
const footerPadding = computed(() => `${theme.value.footerPadding}px`)

const pageScreenZIndex = ref<number>(1000)
const pageScreen = ref<boolean>(false)

function setFullScreen() {
  pageScreenZIndex.value = incMaskZIndex()
  pageScreen.value = true
}
provide(pageFullScreenKey, setFullScreen)

const maskContainerRef = ref()
provide(maskContainerKey, maskContainerRef)


</script>

<style scoped>
.el-header, .el-aside, .el-main, .el-footer {
  box-sizing: border-box;
}

.el-aside {
  width: v-bind(asideWidth);
}

.el-main {
  background-color: var(--el-bg-color);
}


.el-header {
  height: v-bind(headerHeight);
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: rgb(0 21 41 / 8%) 0 1px 4px;
}


.el-main {
  --el-main-padding: v-bind(mainPadding);
  width: v-bind(mainWidth);
  height: v-bind(mainHeight);

}

.el-footer {
  --el-footer-padding: v-bind(footerPadding);
  height: v-bind(footerHeight);
}

.close-page-full-screen {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-bottom-left-radius: 100%;
  background-color: var(--el-bg-color);
  cursor: pointer;
}

.close-page-full-screen:hover, .close-page-full-screen:hover .close-icon {
  background-color: #ecf5ff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  box-sizing: border-box;
  background: transparent;
}
</style>
