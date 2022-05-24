<template>
  <el-container>
    <el-aside :width="asideWidth">
      <aside-bar></aside-bar>
    </el-aside>
    <el-container>
      <el-header>
        <header-bar/>
      </el-header>
      <tag-bar/>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {computed, provide, Ref, ref, watch} from "vue"
import {ElContainer, ElHeader, ElAside, ElMain, ElFooter} from "element-plus"
import Theme from "../config/theme"
import {HeaderBar} from "./components/header"
import {AsideBar} from "./components/aside"
import {TagBar} from "./components/tag"
import {RouterView} from "vue-router"
import {
  mainHeightKey,
  asideWidthKey,
  asideCollapsedKey,
  themeKey,
} from "@/config/app.keys"

const asideCollapsed: Ref<boolean> = ref(false);
provide(asideCollapsedKey, asideCollapsed);

const asideWidth = computed<string>(() => {
  return asideCollapsed.value ? "64px" : `${theme.value.asideWidth}px`;
})
provide(asideWidthKey, asideWidth);

const theme = ref<ThemeConfig>(Theme)
provide(themeKey, theme)

const mainHeight = computed<string>(() => {
  return `calc(100vh - ${theme.value.headerHeight + theme.value.tagBarHeight+ theme.value.footerHeight}px)`;
})
provide(mainHeightKey, mainHeight);


const headerHeight = computed(() => `${theme.value.headerHeight}px`)
const footerHeight = computed(() => `${theme.value.footerHeight}px`)
const mainPadding = computed(() => `${theme.value.mainPadding}px`)
const footerPadding = computed(() => `${theme.value.footerPadding}px`)
const tagBarHeight = computed(() => `${theme.value.tagBarHeight}px`)


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
  width: calc(100vw - v-bind(asideWidth));
  height: calc(100vh - v-bind(headerHeight) - v-bind(footerHeight) - v-bind(tagBarHeight));

}

.el-footer {
  --el-footer-padding: v-bind(footerPadding);
  height: v-bind(footerHeight);
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
