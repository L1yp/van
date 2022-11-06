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
      >
        <el-table-column>
          <el-table-column type="index" label="#" width="50" align="center" header-align="center" />
        </el-table-column>

        <el-table-column>
          <template #header>
            <el-input v-model="param.name" @change="searchEntity(param)" />
          </template>
          <el-table-column prop="name" label="名称" width="300"/>
        </el-table-column>
        <el-table-column>
          <template #header>
            <el-input v-model="param.remark" @change="searchEntity(param)" />
          </template>
          <el-table-column prop="remark" label="备注" :resizable="false" />
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.updateBy" @change="searchEntity(param)" />
          </template>
          <el-table-column prop="update_by" label="更新人" width="200" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.createBy" @change="searchEntity(param)" />
          </template>
          <el-table-column prop="create_by" label="创建人" width="200" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
        </el-table-column>

        <el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160" :resizable="false" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160" :resizable="false" align="center" header-align="center" />
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
        @current-change="searchEntity(param)"
      />
    </div>
    <v-dialog
      v-model="permissionPanelVisible"
      :title="`绑定 【${srcRow?.name || ''}】 权限`"
      @confirm="handleConfirm"
      @cancel="permissionPanelVisible = false"
      destroy-on-close
    >
      <expression-editor ref="editorRef" :role-id="props.roleId" module="ENTITY" :mkey="srcRow?.mkey" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useEntityApi } from "@/service/modeling/entity";
import { onBeforeMount, ref } from "vue";
import { ElTable, ElTableColumn, ElInput, ElPagination } from "element-plus";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import VDialog from "@/components/dialog/VDialog.vue";
import ExpressionEditor from "@/components/permission/editor/ExpressionEditor.vue";
import {useModelingPermissionApi} from "@/service/modeling/permission";

interface Props {
  roleId: string
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)
const param = ref<Partial<ModelingEntityFindParam>>({
  pageIdx: 1,
  pageSize: 50,
})

const { pageData, searchEntity } = useEntityApi(loading)
onBeforeMount(() => searchEntity(param.value))

const { permissionContent, getPermissionContent, bindPermissionContent } = useModelingPermissionApi(loading)

function formatUser(row, column, cellValue, index) {
  return pageData.value.additional?.[cellValue]?.nickname || ''
}

const permissionPanelVisible = ref(false)
const srcRow = ref<ModelingEntityView>()
function handleRowClick(row: ModelingEntityView) {
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
    module: 'ENTITY',
    mkey: srcRow.value.mkey,
    flags: 1,
    content: states,
  }
  bindPermissionContent(param).then(flag => flag && (permissionPanelVisible.value = false))

}

</script>

<style scoped>

</style>