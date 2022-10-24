<template>
  <div v-loading="loading" style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px 0;">
      <el-button plain type="primary" :icon="Plus" @click="handleAdd" >新增</el-button>
    </div>
    <div style="width: 100%; height: calc(100% - 32px - 12px);">
      <el-table
        :data="workflowOptionTypes"
        height="100%"
        border stripe scrollbar-always-on
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="index" label="#" align="center" header-align="center" />
        <el-table-column prop="name" label="名称" width="200" align="center" header-align="center" />
        <el-table-column prop="remark" label="说明" />
      </el-table>

    </div>
    <mask-window v-model="visible">
      <option-add-panel :wf-key="props.wfKey" :scope="props.scope" @close="visible = false" @success="findWorkflowOptionTypes(param)" />
    </mask-window>
    <mask-window v-model="valuePanelVisible">
      <option-value-panel :from-type="fromType" @close="valuePanelVisible = false" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElTable, ElTableColumn } from "element-plus";
import { onBeforeMount, ref } from "vue";
import { Plus } from '@element-plus/icons-vue'
import { useWorkflowOptionApi } from "@/service/workflow/option";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import OptionAddPanel from "./OptionAddPanel.vue";
import OptionValuePanel from "./OptionValuePanel.vue";

interface Props {
  wfKey?: string
  scope: OptionScope
}

const props = defineProps<Props>()
const param: WorkflowOptionTypeFindParam = {
  wf_key: props.wfKey,
  scope: props.scope
}


const loading = ref(false)

const { 
  workflowOptionTypes, 
  workflowOptionValues, 
  findWorkflowOptionTypes, 
  findWorkflowOptionValues 
} = useWorkflowOptionApi(loading)
onBeforeMount(() => findWorkflowOptionTypes(param))

const visible = ref(false)
function handleAdd() {
  visible.value = true
}

const valuePanelVisible = ref(false)
const fromType = ref<WorkflowOptionTypeView>()
function handleRowDblClick(row: WorkflowOptionTypeView) {
  fromType.value = row
  valuePanelVisible.value = true
}

</script>

<style scoped>
</style>