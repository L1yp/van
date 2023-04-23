<template>
  <template v-for="menuOption in props.menuOptions" :key="menuOption.id">
    <template v-if="!menuOption.children?.length || ['PAGE', 'TAB'].includes(menuOption.type) ">
      <el-menu-item v-if="!menuOption.hidden" :index="menuOption.path">
        <el-icon  v-if="menuOption.icon && menuOption.icon.length > 0">
          <template v-if="Icons[menuOption.icon]">
            <component :is="Icons[menuOption.icon]" />
          </template>
          <template v-else>
            <SVGIcon :name="menuOption.icon"/>
          </template>
        </el-icon>
        <template #title>
          <span v-text="menuOption.name"></span>
        </template>
      </el-menu-item>
    </template>
    <template v-else>
      <el-sub-menu :index="menuOption.id">
        <template #title>
          <el-icon v-if="menuOption.icon && menuOption.icon.length > 0">
            <template v-if="Icons[menuOption.icon]">
              <component :is="Icons[menuOption.icon]" />
            </template>
            <template v-else>
              <SVGIcon :name="menuOption.icon"/>
            </template>
          </el-icon>
          <span v-text="menuOption.name"></span>
        </template>
        <NestedMenu :menu-options="menuOption.children"></NestedMenu>
      </el-sub-menu>
    </template>
  </template>
</template>

<script lang="ts" setup>
import SVGIcon from "@/components/common/SVGIcon.vue"
import {ElMenuItem, ElIcon, ElSubMenu} from "element-plus";
import * as Icons from "@element-plus/icons-vue";

interface Props {
  menuOptions: MenuView[]
}

const props = defineProps<Props>()

</script>

<style scoped>
.el-menu--collapse li.el-sub-menu.is-active:after,
.el-menu--collapse .el-menu-item.is-active:after
{
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;
  background-color: var(--el-menu-active-color);
  content: "";
  z-index: 9999;
}

.el-sub-menu {
  position: relative;
}

</style>