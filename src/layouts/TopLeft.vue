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
        <router-view/>
        <div
          v-show="pageScreen"
          style="position: absolute; right: 0; top: 0; width: 30px; height: 30px; border-bottom-left-radius: 100%; background-color: #FFFFFF; cursor: pointer"
          title="关闭全屏"
          @click.stop="cancelPageScreen"
        >
          <s-v-g-icon class="close-page-full-screen" name="close" style="width: 16px; height: 16px; position: absolute; left: 10px; top: 4px"></s-v-g-icon>
        </div>
      </el-main>
      <el-footer :style="pageScreen ? { display: 'none' } : undefined"></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {computed, provide, Ref, ref, watch} from "vue"
import {ElContainer, ElHeader, ElAside, ElMain, ElFooter, ElScrollbar} from "element-plus"
import Theme from "../config/theme"
import {HeaderBar} from "./components/header"
import {AsideBar} from "./components/aside"
import {TagBar} from "./components/tag"
import {RouterView} from "vue-router"
import {
  mainHeightKey,
  asideWidthKey,
  asideCollapsedKey,
  themeKey, mainWidthKey, pageFullScreenKey,
} from "@/config/app.keys"
import SVGIcon from "@/components/common/SVGIcon.vue";

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

const pageScreen = ref<boolean>(false)
provide(pageFullScreenKey, pageScreen)

function cancelPageScreen() {
  pageScreen.value = false
}


</script>

<style scoped>
.el-header, .el-aside, .el-main, .el-footer {
  box-sizing: border-box;
}

.el-aside {
  width: v-bind(asideWidth);
}

.el-main {
  background-color: #F6F8F9;
}


.el-header {
  height: v-bind(headerHeight);
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 1px solid #E3E3E3;
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

.close-page-full-screen:hover{
  color: blue
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
