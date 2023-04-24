<template>
  <div>
    <el-table
      border stripe
      :data="tableData"
      size="small"
    >
      <el-table-column type="index" width="50" label="#" align="center" header-align="center" />
      <el-table-column prop="activity_name" label="节点" min-width="150" show-overflow-tooltip />
      <el-table-column prop="outcome" label="操作" width="100" show-overflow-tooltip />
      <el-table-column prop="assignee" label="操作人" width="150" align="center" header-align="center" show-overflow-tooltip :formatter="formatUser" />
      <el-table-column prop="end_time" label="操作时间" width="160" align="center" header-align="center" />
      <el-table-column prop="duration_in_millis" label="审批耗时" width="150" :formatter="formatDuration" align="center" header-align="center" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { userMapKey } from "@/config/app.keys";
import { toReadableDuration } from "@/utils/common";
import { ElTable, ElTableColumn, } from "element-plus";
import { computed, inject } from "vue";


interface Props {
  activityList: WorkflowActivityInfo[]
}

const props = defineProps<Props>()

const tableData = computed(() => props.activityList.filter(it => it.activity_type === 'userTask' && !!it.end_time))

const userMap = inject(userMapKey)

function formatUser(row: WorkflowActivityInfo, column: any, cellValue: string, index: number) {
  return userMap.get(cellValue).nickname
}

function formatDuration(row: WorkflowActivityInfo, column: any, cellValue: number, index: number) {
  return toReadableDuration(Math.round(cellValue / 1000))
}

</script>