<template>
  <div style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px 0; ">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
    </div>
    <el-tabs v-model="scope" type="border-card" style="width: 100%; height: calc(100% - 32px - 12px);">
      <el-tab-pane name="DEFAULT" label="默认字段">
        <FieldTable @edit="row => handleEditField('DEFAULT', row)" @delete="row => handleDeleteField('DEFAULT', row)" :loading="loading" :data="defaultFields" />
      </el-tab-pane>
      <el-tab-pane name="GLOBAL" label="全局字段">
        <FieldTable @edit="row => handleEditField('GLOBAL', row)" @delete="row => handleDeleteField('GLOBAL', row)" :loading="loading" :data="globalFields" />
        <div id="field-container"></div>
      </el-tab-pane>
    </el-tabs>
    
    <MaskWindow v-model="visible">
      <FieldAddPanel :scope="scope" @close="visible = false" @success="loadFields" />
    </MaskWindow>
    <mask-window v-model="updatePanelVisible" teleport-to="#field-container">
      <field-update-panel :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>
<script lang="ts" setup>
import { useWorkflowFieldApi } from "@/service/workflow/field";
import { ElTabs, ElTabPane, ElButton, ElMessage } from "element-plus";
import { onBeforeMount, provide, ref } from "vue";
import FieldTable from "./FieldTable.vue";
import { Plus } from "@element-plus/icons-vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import FieldAddPanel from "./FieldAddPanel.vue";
import FieldUpdatePanel from "./FieldUpdatePanel.vue";
import { workflowDefKey } from "../keys";

const scope = ref<FieldScope>('DEFAULT')

const loading = ref(false)
const { defaultFields, findDefaultFields, globalFields, findGlobalFields, deleteField } = useWorkflowFieldApi(loading)

const workflowDef = ref<WorkflowTypeDefView>()
provide(workflowDefKey, workflowDef)

onBeforeMount(loadFields)
async function loadFields() {
  await findDefaultFields()
  await findGlobalFields()
}

const visible = ref(false)
function handleAdd() {
  visible.value = true
}


const updatePanelVisible = ref(false)
const sourceField = ref<WorkflowFieldDefView>()
async function handleEditField(scope: FieldScope, row: WorkflowFieldDefView) {
  if (scope === 'GLOBAL') {
    sourceField.value = row
    updatePanelVisible.value = true
  }
  else if (scope === 'DEFAULT') {
    ElMessage.warning('默认字段无法编辑')
  }
}

async function handleDeleteField(scope: FieldScope, row: WorkflowFieldDefView) {
  if (scope === 'GLOBAL') {
    const result = await deleteField(row.id)
    if (result) {
      await findGlobalFields()
    }
  }
  else if (scope === 'DEFAULT') {
    ElMessage.warning('默认字段无法删除')
  }
  
}

</script>

<style scoped>
:deep(.el-tabs__content) {
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: calc(100%);
}
</style>