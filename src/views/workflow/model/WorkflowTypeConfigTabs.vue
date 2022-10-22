<template>
  <el-tabs type="border-card" style="height: 100%">
    <el-tab-pane label="基本信息">
      <DefUpdatePanel/>
    </el-tab-pane>
    <el-tab-pane label="字段">
      <FieldPanel />
      <div id="field-container"></div>
    </el-tab-pane>
    <el-tab-pane label="视图配置">
      <div>视图配置</div>
    </el-tab-pane>
    <el-tab-pane label="数据源">
      <div>视图配置</div>
    </el-tab-pane>
  </el-tabs>

</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import DefUpdatePanel from "@/views/workflow/model/type/DefUpdatePanel.vue";
import FieldPanel from "@/views/workflow/model/field/FieldPanel.vue";


</script>

<style scoped>
:deep(.el-tabs__content) {
  /* header = 39px; padding = 15 * 2 = 30px */
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: 100%;
}

</style>