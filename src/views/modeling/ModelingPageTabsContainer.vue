<template>
  <el-tabs type="border-card" v-model="activeName" style="width: calc(100% - 2px); height: calc(100% - 2px);">
    <el-tab-pane
      style="height: 100%"
      v-for="item in menuOptions"
      :key="item.id"
      :label="item.name"
      :name="item.name"
    >
      <template v-if="item.type === 'ENTITY' || item.type === 'WORKFLOW'">
        <ModelingViewContainer :module="item.type" :mkey="item.path" />
        <div :id="`modeling-panel-${item.path}`"></div>
      </template>
      <template v-else-if="item.type === 'PAGE'">
        <component :is="routeToView(item.component)" />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ElTabs, ElTabPane } from "element-plus";
import {useMenuData} from "@/service/system/menu";
import {ref} from "vue";
import { routeToView } from '@/router'
import ModelingViewContainer from "@/views/modeling/ModelingViewContainer.vue";


const route = useRoute()
const menuOptions = route.meta.menuOption?.children as MenuView[]
console.log('children', menuOptions);

const activeName = ref<string>(menuOptions?.[0].name || '')

const loading = ref(false)
const {} = useMenuData(loading)


</script>

<style scoped>
:deep(.el-tabs__content) {
  height: calc(100% - 69px);
}
</style>