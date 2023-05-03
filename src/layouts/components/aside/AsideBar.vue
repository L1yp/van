<template>
  <div class="aside-header">
    <img src="/favicon.ico" alt="logo" style="width: 30px; height: 30px;" />
    <span style="font-size: 20px" v-if="layoutStore.asideOpened">Admin</span>
  </div>
  <div class="menu-wrapper">
    <el-scrollbar always :native="deviceType === 'h5'">
      <el-menu
          :default-active="route.path"
          :collapse="!layoutStore.asideOpened"
          :collapse-transition="false"
          :router="true"
      >
        <NestedMenu :menu-options="menuOptions"/>
      </el-menu>
    </el-scrollbar>
  </div>

</template>

<script lang="ts" setup>
import { inject, computed } from "vue"
import { ElMenu, ElScrollbar } from "element-plus";
import NestedMenu from "./NestedMenu.vue";
import { useRoute } from "vue-router";
import { menuOptionsKey } from "@/config/app.keys";
import { useThemeStore } from "@/store/theme";
import { useLayoutStore } from "@/store/layout";
import { getDeviceType } from "@/utils/common";

const route = useRoute();
const menuOptions = inject(menuOptionsKey)

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
const deviceType = getDeviceType()

const headerHeight = computed(() => `${themeStore.headerHeight}px`)

</script>

<style scoped>
div.aside-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: v-bind(headerHeight);
  border-bottom: 1px solid var(--el-border-color);
}

div.menu-wrapper {
  height: calc(100dvh - v-bind(headerHeight));
}


</style>