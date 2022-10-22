<template>
  <div style="width: 100%; height: 100%;">
    <el-table
      v-loading="props.loading"
      height="100%"
      border stripe scrollbar-always-on
      :data="props.data"
    >
      <el-table-column type="index"  label="#" align="center" header-align="center" />
      <el-table-column prop="field"  label="字段" width="150" align="center" header-align="center" />
      <el-table-column prop="label"  label="名称" width="200" align="center" header-align="center" />
      <el-table-column prop="type"  label="类型" width="100" align="center" header-align="center" />
      <el-table-column prop="remark" label="说明" />

    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn } from "element-plus";

interface Props {
  loading: boolean
  data: WorkflowFieldDefView[]
}

const props = defineProps<Props>()
console.log('field table', props);

</script>

<style scoped>

</style>