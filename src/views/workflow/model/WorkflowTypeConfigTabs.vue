<template>
  <el-tabs type="border-card" >
    <el-tab-pane label="基本信息">
      <WFBasicConfig :src="props.src" />
    </el-tab-pane>
    <el-tab-pane label="字段">
      <div>字段</div>
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
import WFBasicConfig from "@/views/workflow/model/type/WFBasicConfig.vue";

interface Props {
  src?: WorkflowTypeDefView
}

const props = defineProps<Props>()


</script>