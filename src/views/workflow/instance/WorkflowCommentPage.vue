<template>
  <div style="width: 100%; height: 100%;">
    <el-table
      border stripe
      :data="props.commentList"
      size="small"
    >
      <el-table-column type="index" label="#" width="50" align="center" header-align="center" />
      <el-table-column prop="user_id" label="用户" width="120" align="center" header-align="center" :formatter="formatUser" />
      <el-table-column prop="time" label="时间" width="160" align="center" header-align="center" />
      <el-table-column prop="message.type" label="操作" width="150" :formatter="formatOperation" />
      <el-table-column prop="message.comment" label="内容" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { userMapKey } from "@/config/app.keys";
import { ElTable, ElTableColumn } from "element-plus";
import { inject } from "vue";


interface Props {
  commentList: TaskComment[]
}

const props = defineProps<Props>()

const userMap = inject(userMapKey)

function formatUser(row: TaskComment, column: any, cellValue: string, index: number) {
  return userMap.get(cellValue).nickname
}

function formatOperation(row: TaskComment, column: any, cellValue: string, index: number) {
  return row.message.type === 'complete' ? row.message.outcome : '评论'
}

</script>

<style scoped>

</style>