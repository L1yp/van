<template>
  <el-tabs tab-position="left" class="entity-page-tabs">
    <el-tab-pane label="查看页面">
      <FormDesigner name="VIEW" v-bind="$props" />
    </el-tab-pane>
    <el-tab-pane label="新增页面">
      <FormDesigner name="ADD" v-bind="$props" />
    </el-tab-pane>
    <el-tab-pane label="更新页面">
      <FormDesigner name="UPDATE" v-bind="$props" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import FormDesigner from '@/views/modeling/form/designer.vue'

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