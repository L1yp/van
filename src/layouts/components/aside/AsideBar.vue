<template>
  <div class="aside-header">
    <SVGIcon name="logo" width="30px" height="30px" color="red" bg-color="#FFFFFFFF"></SVGIcon>
    <span style="font-size: 20px" v-if="!asideCollapsed">Admin</span>
  </div>
  <div class="menu-wrapper">
    <el-scrollbar height="100%">
      <el-menu
          :default-active="route.path"
          :collapse="asideCollapsed"
          :collapse-transition="false"
          :router="true"
      >
        <NestedMenu :menu-options="menuOptions"/>

      </el-menu>
    </el-scrollbar>
  </div>

</template>

<script lang="ts" setup>
import {ref, inject, Ref, computed} from "vue"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {ElMenu, ElScrollbar} from "element-plus";
import NestedMenu from "./NestedMenu.vue";
import {useRoute} from "vue-router";
import {asideCollapsedKey, menuOptionsKey, themeKey} from "@/config/app.keys";

const route = useRoute();
const menuOptions = inject(menuOptionsKey)

const theme = inject(themeKey)

/**
 * 是否折叠菜单侧边栏
 */
const asideCollapsed = inject<Ref<boolean>>(asideCollapsedKey)

const headerHeight = computed(() => `${theme.value.headerHeight}px`)

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
  height: calc(100vh - v-bind(headerHeight));
}


</style>