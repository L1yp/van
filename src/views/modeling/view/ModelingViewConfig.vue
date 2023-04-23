<template>
  <div style="width: 100%; height: 100%;">
    <div>
      <el-button :icon="Plus" type="primary" @click="handleAdd">新增</el-button>
      <span style="color: red; font-weight: bold; margin-left: 10px;">双击进入配置</span>
    </div>

    <div style="width: 100%; height: calc(100% - 32px - 10px - 36px); margin-top: 10px">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="viewDetailInfoList"
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
            <el-input v-model="param.name" @change="searchView(param)" />
          </template>
          <el-table-column prop="name" label="名称" min-width="200" />
        </el-table-column>
        <el-table-column>
          <el-table-column prop="sn" label="序号" width="60" :resizable="false" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.updateBy" @change="searchView(param)" />
          </template>
          <el-table-column prop="update_by.nickname" label="更新人" width="200" :resizable="false" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.createBy" @change="searchView(param)" />
          </template>
          <el-table-column prop="create_by.nickname" label="创建人" width="200" :resizable="false" align="center" header-align="center" />
        </el-table-column>

        <el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160" :resizable="false" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160" :resizable="false" align="center" header-align="center" />
        </el-table-column>
      </el-table>
    </div>

    <MaskWindow v-model="addPanelVisible" teleport-to="#modeling-view-config">
      <ModelingViewAddPanel :fields="modelingFields" @close="addPanelVisible = false" @success="searchView(param)" v-bind="$props"/>
    </MaskWindow>
    <MaskWindow v-model="updatePanelVisible" teleport-to="#modeling-view-config">
      <ModelingViewUpdatePanel :src="srcRow" :fields="modelingFields" @close="updatePanelVisible = false" @success="searchView(param)" v-bind="$props"/>
    </MaskWindow>

  </div>

</template>

<script lang="ts" setup>
import { useViewApi } from "@/service/modeling/view";
import { onBeforeMount, ref } from "vue";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import { ElTable, ElTableColumn, ElButton, ElInput } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import ModelingViewAddPanel from "@/views/modeling/view/ModelingViewAddPanel.vue";
import ModelingViewUpdatePanel from "@/views/modeling/view/ModelingViewUpdatePanel.vue";
import {useModelingFieldApi} from "@/service/modeling/field";


interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()

const loading = ref(false)
const param = ref<ModelingViewSearchParam>({
  module: props.module,
  mkey: props.mkey,
})
const { viewDetailInfoList, searchView } = useViewApi(loading)
onBeforeMount(() => searchView(param.value))
const { modelingFields, findModelingFields } = useModelingFieldApi(loading)
onBeforeMount(() => findModelingFields(props.module, props.mkey))

function handleAdd() {
  addPanelVisible.value = true

}

const addPanelVisible = ref(false)
const updatePanelVisible = ref(false)
const srcRow = ref<ModelingViewDetailInfo>()
function handleRowDbClick(row: ModelingViewDetailInfo) {
  srcRow.value = row
  updatePanelVisible.value = true
}

</script>

<style scoped>

</style>