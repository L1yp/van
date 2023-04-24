<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: 32px; display: flex">
      <el-button :icon="Plus" type="primary" @click="handleAdd">新增</el-button>
      <el-scrollbar style="margin-left: 10px" wrap-style="display: flex; align-items: center">
        <div style="white-space: nowrap; color: red; font-weight: bold; ">双击进入配置</div>
      </el-scrollbar>
    </div>

    <div style="width: 100%; height: calc(100% - 32px - 10px - 36px); margin-top: 10px">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="pageData.data"
        max-height="100%"
        border stripe scrollbar-always-on
        row-key="id"
        :row-style="{ cursor: 'pointer' }"
        @row-dblclick="handleRowDbClick"
        size="small"
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
          <el-table-column prop="remark" label="备注" :resizable="false" min-width="200" show-overflow-tooltip />
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
    <MaskWindow v-model="addPanelVisible">
      <EntityAddPanel @success="searchEntity(param)" @close="addPanelVisible = false" />
    </MaskWindow>
    <MaskWindow v-model="updatePanelVisible">
      <ModelingConfigTabs @close="handleCloseUpdatePanel" />
    </MaskWindow>

  </div>
</template>

<script lang="ts" setup>
import { useEntityApi } from "@/service/modeling/entity";
import { computed, inject, onBeforeMount, provide, ref} from "vue";
import { ElTable, ElTableColumn, ElInput, ElButton, ElPagination, ElScrollbar } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import EntityAddPanel from "./config/EntityAddPanel.vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import { modelingEntityKey } from "../keys";
import ModelingConfigTabs from "./config/ModelingConfigTabs.vue";
import {useFieldStore} from "@/store/field-config";

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

const addPanelVisible = ref(false)
const updatePanelVisible = ref(false)
const srcRow = ref<ModelingEntityView>()
provide(modelingEntityKey, srcRow)

const store = useFieldStore()

function handleRowDbClick(row: ModelingEntityView) {
  store.scope = 'ENTITY_PRIVATE'
  store.module = 'ENTITY'
  store.mkey = row.mkey

  srcRow.value = row
  updatePanelVisible.value = true
}


function handleAdd() {
  addPanelVisible.value = true
}

function handleCloseUpdatePanel() {
  updatePanelVisible.value = false
  searchEntity(param.value)
}

const tableRef = ref<InstanceType<typeof ElTable>>()

</script>

<style scoped>

</style>