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
        @row-dblclick="handleRowDbClick"
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
    <MaskWindow v-model="permissionPanelVisible">
      <permission-editor module="ENTITY" :mkey="srcRow?.mkey" />
    </MaskWindow>

  </div>
</template>

<script lang="ts" setup>
import { useEntityApi } from "@/service/modeling/entity";
import { onBeforeMount, provide, ref } from "vue";
import { ElTable, ElTableColumn, ElInput, ElPagination } from "element-plus";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import PermissionEditor from "@/views/modeling/permission/PermissionEditor.vue";

const loading = ref<boolean>(false)
const param = ref<Partial<ModelingEntityFindParam>>({
  pageIdx: 1,
  pageSize: 50,
})

const { pageData, searchEntity } = useEntityApi(loading)
onBeforeMount(() => searchEntity(param.value))

function formatUser(row, column, cellValue, index) {
  return pageData.value.additional?.[cellValue]?.nickname || ''
}

const permissionPanelVisible = ref(false)
const srcRow = ref<ModelingEntityView>()


function handleRowDbClick(row: ModelingEntityView) {
  srcRow.value = row
  permissionPanelVisible.value = true
}


const tableRef = ref<InstanceType<typeof ElTable>>()

</script>

<style scoped>

</style>