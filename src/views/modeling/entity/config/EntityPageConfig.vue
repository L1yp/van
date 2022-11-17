<template>
  <el-tabs tab-position="left" class="entity-page-tabs">
    <el-tab-pane label="查看页面">
      <FormDesigner page-key="VIEW" name="查看页面" v-bind="$props" />
    </el-tab-pane>
    <el-tab-pane label="新增页面">
      <FormDesigner page-key="ADD" name="新增页面" v-bind="$props" />
    </el-tab-pane>
    <el-tab-pane label="更新页面">
      <FormDesigner page-key="UPDATE" name="编辑页面" v-bind="$props" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import FormDesigner from '@/views/process/form/designer.vue'

interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()


</script>

<style scoped>
.entity-page-tabs {
  width: 100%;
  height: 100%;
}

.entity-page-tabs>:deep(.el-tabs__content) {
  width: calc(100% - 95px - 10px);
  height: 100%;
}
</style>