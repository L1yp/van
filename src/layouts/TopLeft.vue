<template>
  <el-container>
    <template v-if="deviceType === 'h5'">
      <el-drawer
        class="aside-menu-drawer"
        :size="200"
        :with-header="false"
        v-model="layoutStore.asideOpened"
        direction="ltr"
      >
        <aside-bar></aside-bar>
      </el-drawer>
    </template>
    <template v-else>
      <el-aside :width="layoutStore.asideWidth" :style="layoutStore.pageScreen ? { display: 'none' } : undefined">
        <aside-bar></aside-bar>
      </el-aside>
    </template>


    <el-container>
      <el-header :style="layoutStore.pageScreen ? { display: 'none' } : undefined">
        <header-bar/>
      </el-header>
      <tag-bar :style="layoutStore.pageScreen ? { display: 'none' } : undefined"/>

      <el-main style="position: relative" :style="{ width: layoutStore.mainWidth, height: layoutStore.mainHeight }">
        <router-view v-slot="{ Component, route }">
          <template v-if="mode === 'dev'">
            <keep-alive :include="keepAliveStore.keepAliveNames">
              <component :is="Component" :key="route.fullPath" v-if="keepAliveStore.refreshComponent" />
            </keep-alive>
          </template>
          <template v-else>
            <transition name="fade" mode="out-in" appear>
              <keep-alive>
                <component :is="Component" :key="route.fullPath" v-if="keepAliveStore.refreshComponent" />
              </keep-alive>
            </transition>
          </template>
        </router-view>


        <div
          v-show="layoutStore.pageScreen"
          class="close-page-full-screen"
          title="关闭全屏"
          @click.stop="layoutStore.pageScreen = false"
          :style="{ 'z-index': layoutStore.incrementZIndex() }"
        >
          <s-v-g-icon class="close-icon" name="close" style="width: 16px; height: 16px; position: absolute; left: 10px; top: 4px"></s-v-g-icon>
        </div>
        <div ref="maskContainerRef" style="position: absolute; top: 0; left: 0; width: 100%;"></div>
      </el-main>
      <el-footer :style="layoutStore.pageScreen ? { display: 'none' } : undefined"></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from "vue"
import { ElContainer, ElHeader, ElAside, ElMain, ElFooter, ElDrawer } from "element-plus"
import { HeaderBar } from "./components/header"
import { AsideBar } from "./components/aside"
import { TagBar } from "./components/tag"
import { RouterView } from "vue-router"
import SVGIcon from "@/components/common/SVGIcon.vue";
import { getDeviceType } from "@/utils/common"
import { useKeepAliveStore } from "@/store/keep-alive";
import { useLayoutStore } from "@/store/layout";
import { useThemeStore } from "@/store/theme";


const mode = import.meta.env.MODE

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
const keepAliveStore = useKeepAliveStore()

const deviceType = getDeviceType()
console.log('deviceType', deviceType);
watch(deviceType, (newVal, oldVal) => {
  console.log('watch deviceType===================================', newVal, oldVal)
  if (newVal === 'h5') {
    layoutStore.asideOpened = false
  }
}, { immediate: true })

const maskContainerRef = ref<HTMLDivElement>()
onMounted(() => {
  layoutStore.maskContainerRef = maskContainerRef.value!
})

</script>

<style scoped>
.el-header, .el-aside, .el-main, .el-footer {
  box-sizing: border-box;
}

.el-aside {
  width: v-bind(layoutStore.asideWidth);
}

.el-main {
  background-color: var(--el-bg-color);
}


.el-header {
  height: v-bind(themeStore.headerHeight + 'px');
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: rgb(0 21 41 / 8%) 0 1px 4px;
}


.el-main {
  --el-main-padding: v-bind(themeStore.mainPadding + 'px');
  width: v-bind('layoutStore.mainWidth');
  height: v-bind('layoutStore.mainHeight');

}

.el-footer {
  --el-footer-padding: v-bind(themeStore.footerPadding + 'px') ;
  height: v-bind('themeStore.footerHeight') + 'px';
}

.close-page-full-screen {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-bottom-left-radius: 100%;
  background-color: var(--el-bg-color-overlay);
  cursor: pointer;
  border: 1px solid var(--el-border-color);
}

.close-page-full-screen:hover, .close-page-full-screen:hover .close-icon {
  background-color: var(--el-bg-color-page);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.aside-menu-drawer .el-drawer__body) {
  padding: 0;
}

</style>