<template>
  <div style="width: 100%; height: 100%;">
    <el-tabs type="border-card" class="task-tabs">
      <el-tab-pane label="待处理">
        <WorkflowTodoTaskPage/>
      </el-tab-pane>
      <el-tab-pane label="已处理">
        <WorkflowDoneTaskPage/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from 'element-plus'
import WorkflowTodoTaskPage from "@/views/workflow/task/todo/WorkflowTodoTaskPage.vue";
import WorkflowDoneTaskPage from "@/views/workflow/task/done/WorkflowDoneTaskPage.vue";

</script>

<style scoped>
* {
  box-sizing: border-box;
}

.task-tabs {
  width: 100%;
  height: 100%;
}

.task-tabs :deep(.el-tabs__content) {
  box-sizing: border-box;
  height: calc(100% - 39px);
}

.task-tabs :deep(.el-tabs__content .el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>