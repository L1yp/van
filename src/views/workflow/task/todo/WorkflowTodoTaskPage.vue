<template>
  <div v-loading="loading" style="width: 100%; height: 100%;">
    <el-table
      border stripe
      :data="todoTaskPage.data"
      @row-dblclick="handleDblClick"
    >
      <el-table-column type="index" label="#" width="50" align="center" header-align="center" />
      <el-table-column prop="workflow_type" label="流程类型" width="120" align="center" header-align="center" show-tooltip-when-overflow>
        <template #default="scope">
          <router-link :to="`/workflow/instance/list/${scope.row.mkey}`" v-text="scope.row.workflow_type"></router-link>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <el-input v-model="param.name" clearable @change="listTodoTask(param)" />
        </template>
        <el-table-column prop="process_instance_name" label="标题" min-width="150">
          <template #default="scope">
            <router-link :to="`/workflow/instance/${scope.row.mkey}/${scope.row.process_instance_id}`" v-text="scope.row.process_instance_name"></router-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="create_time" label="到达时间" width="160" />
      <el-table-column prop="start_user_id" label="创建人" width="120" align="center" header-align="center" :formatter="formatUser" />
      <el-table-column prop="start_time" label="创建时间" width="160" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {inject, onBeforeMount, ref} from 'vue'
import { ElTable, ElTableColumn, ElInput } from 'element-plus'
import { useWorkflowTaskApi } from "@/service/workflow";
import {useRouter} from "vue-router";

const loading = ref(false)
const router = useRouter()
const param = ref<WorkflowTodoTaskFindParam>({
  pageIdx: 1,
  pageSize: 20,
  name: '',
})

const { todoTaskPage, listTodoTask } = useWorkflowTaskApi(loading)

onBeforeMount(() => listTodoTask(param.value))

function formatUser(row: WorkflowTodoTaskView, column: any, cellValue: string, index: number) {
  return todoTaskPage.value.additional?.user?.find(it => it.id === cellValue)?.nickname || ''
}

function handleDblClick(row: WorkflowTodoTaskView) {
  router.push(`/workflow/instance/${row.mkey}/${row.process_instance_id}`)
}

</script>