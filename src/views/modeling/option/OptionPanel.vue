<template>
  <div v-loading="loading" style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px 0;">
      <el-button plain type="primary" :icon="Plus" @click="handleAdd" >新增</el-button>
      <span style="color: red; font-weight: bold; margin-left: 10px;">双击进入配置选项</span>
    </div>
    <div style="width: 100%; height: calc(100% - 32px - 12px);">
      <el-table
        :data="modelingOptionTypes"
        height="100%"
        border stripe scrollbar-always-on
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="index" label="#" align="center" header-align="center" />
        <el-table-column prop="name" label="名称" width="200" align="center" header-align="center" />
        <el-table-column prop="remark" label="说明" min-width="200" />
      </el-table>

    </div>
    <mask-window v-model="visible" teleport-to="#option-container">
      <option-add-panel v-bind="$props" @close="visible = false" @success="findModelingOptionTypes(param)" />
    </mask-window>
    <mask-window v-model="valuePanelVisible" teleport-to="#option-container">
      <option-value-panel :from-type="fromType" @close="valuePanelVisible = false" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElTable, ElTableColumn } from "element-plus";
import { onBeforeMount, ref } from "vue";
import { Plus } from '@element-plus/icons-vue'
import { useModelingOptionApi } from "@/service/modeling/option";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import OptionAddPanel from "./OptionAddPanel.vue";
import OptionValuePanel from "./OptionValuePanel.vue";

interface Props {
  scope: OptionScope
  mkey?: string
  module?: ModelingModule
}

const props = defineProps<Props>()
const param: ModelingOptionTypeFindParam = {
  mkey: props.mkey,
  scope: props.scope
}


const loading = ref(false)

const {
  modelingOptionTypes,
  modelingOptionValues,
  findModelingOptionTypes,
  findModelingOptionValues
} = useModelingOptionApi(loading)
onBeforeMount(() => findModelingOptionTypes(param))

const visible = ref(false)
function handleAdd() {
  visible.value = true
}

const valuePanelVisible = ref(false)
const fromType = ref<ModelingOptionTypeView>()
function handleRowDblClick(row: ModelingOptionTypeView) {
  fromType.value = row
  valuePanelVisible.value = true
}

</script>

<style scoped>
</style>