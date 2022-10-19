<template>
  <div>
    <div>
      <el-button :icon="Plus" type="primary">新增</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="pageData.data"
      :max-height="tableHeight"
      border stripe
      row-key="id"
      :tree-props="{ children: 'children' }"
      @row-dblclick="handleRowDbClick"
      style="margin-top: 10px"
    >
      <el-table-column type="index" label="#" width="50" align="center" header-align="center" />
      <el-table-column>
        <template #header>
          <el-input v-model="param.name" @change="loadPage(param)" />
        </template>
        <el-table-column prop="name" label="名称" width="300"/>
      </el-table-column>
      <el-table-column>
        <template #header>
          <el-input v-model="param.remark" @change="loadPage(param)" />
        </template>
        <el-table-column prop="remark" label="备注" />
      </el-table-column>
      <el-table-column prop="update_by" label="更新人" width="100" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
      <el-table-column prop="update_time" label="更新时间" width="160" :resizable="false" align="center" header-align="center" />
      <el-table-column prop="create_by" label="创建人" width="100" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
      <el-table-column prop="create_time" label="创建时间" width="160" :resizable="false" align="center" header-align="center" />
    </el-table>
    <Teleport :to="maskContainer || 'body'">
      <WorkflowTypeConfigTabs  />
      <WorkflowVerConfigTabs/>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useWorkflowApi } from "@/service/workflow";
import {computed, inject, onBeforeMount, ref} from "vue";
import { ElTable, ElTableColumn, ElInput, ElButton } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {mainHeightKey, maskContainerKey, maskVisibleKey, themeKey} from "@/config/app.keys";
import WorkflowTypeConfigTabs from "@/views/workflow/model/WorkflowTypeConfigTabs.vue";
import WorkflowVerConfigTabs from "@/views/workflow/model/WorkflowVerConfigTabs.vue";

const maskVisible = inject(maskVisibleKey)
const maskContainer = inject(maskContainerKey)

const loading = ref<boolean>(false)
const param = ref<WorkflowTypeDefPageParam>({
  pageIdx: 1,
  pageSize: 20,
  name: '',
  remark: '',
})

const { pageData, loadPage } = useWorkflowApi(loading)
onBeforeMount(() => loadPage(param.value))

function formatUser(row, column, cellValue, index) {
  return pageData.value.additional?.[cellValue]?.nickname || ''
}

const theme = inject(themeKey)
const mainHeight = inject(mainHeightKey)
const tableHeight = computed(() => {
  // 32 toolbar
  // 10 marginTop
  return `${mainHeight.value} - ${theme.value.mainPadding * 2 + 32 + 10}px`
})


function handleRowDbClick(row, column, event) {
  if (row.children?.length) {
    const item = row as WorkflowTypeDefView
    maskVisible.value = true
  }
}

</script>

<style scoped>
:deep(table.el-table__body tr.el-table__row td:first-child span.el-table__placeholder) {
  display: none;
}

</style>