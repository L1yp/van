<template>
  <div style="width: 100%; height: 100%;">
    <div style="width: 100%; height: calc(100% - 36px)">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="pageData.data"
        max-height="100%"
        border stripe scrollbar-always-on
        row-key="id"
        :row-style="{ cursor: 'pointer' }"
        @row-click="handleRowClick"
        size="small"
      >
        <el-table-column>
          <el-table-column type="index" label="#" width="50" align="center" header-align="center"/>
        </el-table-column>

        <el-table-column>
          <template #header>
            <el-input v-model="param.name" @change="loadPageWithoutVer(param)"/>
          </template>
          <el-table-column prop="name" label="名称" width="300"/>
        </el-table-column>
        <el-table-column>
          <template #header>
            <el-input v-model="param.remark" @change="loadPageWithoutVer(param)"/>
          </template>
          <el-table-column prop="remark" label="备注" :resizable="false" min-width="200" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.updateBy" @change="loadPageWithoutVer(param)"/>
          </template>
          <el-table-column prop="update_by" label="更新人" width="200" :resizable="false" :formatter="formatUser"
                           align="center" header-align="center"/>
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.createBy" @change="loadPageWithoutVer(param)"/>
          </template>
          <el-table-column prop="create_by" label="创建人" width="200" :resizable="false" :formatter="formatUser"
                           align="center" header-align="center"/>
        </el-table-column>

        <el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160" :resizable="false" align="center"
                           header-align="center"/>
        </el-table-column>
        <el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160" :resizable="false" align="center"
                           header-align="center"/>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        :total="pageData.total"
        v-model:current-page="param.pageIdx"
        v-model:page-size="param.pageSize"
        :page-sizes="[50]"
        layout="prev, pager, next"
        @current-change="loadPageWithoutVer(param)"
      />
    </div>
    <v-dialog
      v-model="permissionPanelVisible"
      :title="`绑定 【${srcRow?.name || ''}】 权限`"
      @confirm="handleConfirm"
      @cancel="permissionPanelVisible = false"
      destroy-on-close

      :full-screen="deviceType === 'h5'"
      :fixed-body-height="deviceType === 'h5'"
      :use-body-scrolling="deviceType !== 'h5'"

    >
      <expression-editor ref="editorRef" :role-id="props.roleId" module="WORKFLOW" :mkey="srcRow!.key"/>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { ElTable, ElTableColumn, ElInput, ElPagination } from "element-plus";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import VDialog from "@/components/dialog/VDialog.vue";
import ExpressionEditor from "@/components/permission/editor/ExpressionEditor.vue";
import { useModelingPermissionApi } from "@/service/modeling/permission";
import { useWorkflowApi } from "@/service/workflow";
import { getDeviceType } from "@/utils/common";

interface Props {
  roleId: string
}

const props = defineProps<Props>()

const deviceType = getDeviceType()

const loading = ref<boolean>(false)
const param = ref<WorkflowTypeDefPageParam>({
  pageIdx: 1,
  pageSize: 50,
})

const {pageData, loadPageWithoutVer} = useWorkflowApi(loading)
onBeforeMount(() => loadPageWithoutVer(param.value))

const {permissionContent, getPermissionContent, bindPermissionContent} = useModelingPermissionApi(loading)

function formatUser(row: WorkflowTypeDefView, column: any, cellValue: string, index: number): string {
  return pageData.value?.additional?.[cellValue]?.nickname || ''
}

const permissionPanelVisible = ref(false)
const srcRow = ref<WorkflowTypeDefView>()

function handleRowClick(row: WorkflowTypeDefView) {
  srcRow.value = row
  permissionPanelVisible.value = true
}


const tableRef = ref<InstanceType<typeof ElTable>>()
const editorRef = ref<InstanceType<typeof ExpressionEditor>>()

function handleConfirm() {
  const states: ExpressionModel[] = editorRef.value.readEditorState()
  console.log('states', states)


  const param: ModelingPermissionBindParam = {
    role_id: props.roleId,
    module: 'WORKFLOW',
    mkey: srcRow.value?.key!,
    flags: 1,
    content: states,
  }
  bindPermissionContent(param).then(flag => flag && (permissionPanelVisible.value = false))

}

</script>

<style scoped>

</style>