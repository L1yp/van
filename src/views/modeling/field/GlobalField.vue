<template>
  <div style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px 0; ">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
    </div>
    <el-tabs model-value="ENTITY_DEFAULT" type="border-card" style="width: 100%; height: calc(100% - 32px - 12px);">
      <el-tab-pane name="ENTITY_DEFAULT" label="实体默认字段">
        <field-table @edit="row => handleEditField('ENTITY_DEFAULT', row)" @delete="row => handleDeleteField('ENTITY_DEFAULT', row)" :loading="loading" :data="defaultEntityFields" />
      </el-tab-pane>
      <el-tab-pane name="WORKFLOW_DEFAULT" label="流程默认字段">
        <field-table @edit="row => handleEditField('WORKFLOW_DEFAULT', row)" @delete="row => handleDeleteField('WORKFLOW_DEFAULT', row)" :loading="loading" :data="defaultWorkflowFields" />
      </el-tab-pane>
      <el-tab-pane name="GLOBAL" label="全局字段">
        <field-table @edit="row => handleEditField('GLOBAL', row)" @delete="row => handleDeleteField('GLOBAL', row)" :loading="loading" :data="globalFields" />
        <div id="field-container"></div>
      </el-tab-pane>
    </el-tabs>

    <MaskWindow v-model="visible">
      <FieldAddPanel @close="visible = false" @success="loadFields" />
    </MaskWindow>
    <mask-window v-model="updatePanelVisible" teleport-to="#field-container">
      <field-update-panel scope="GLOBAL" :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>
<script lang="ts" setup>
import { ElTabs, ElTabPane, ElButton, ElMessage } from "element-plus";
import { onBeforeMount, ref } from "vue";
import FieldTable from "./FieldTable.vue";
import { Plus } from "@element-plus/icons-vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import FieldAddPanel from "./FieldAddPanel.vue";
import FieldUpdatePanel from "./FieldUpdatePanel.vue";
import { useModelingFieldApi } from "@/service/modeling/field";
import {useFieldStore} from "@/store/field-config";

const store = useFieldStore()

const loading = ref(false)
const {
  defaultEntityFields, findDefaultEntityFields,
  defaultWorkflowFields, findDefaultWorkflowFields,
  globalFields, findGlobalFields, deleteField
} = useModelingFieldApi(loading)


onBeforeMount(loadFields)
async function loadFields() {
  await findDefaultEntityFields()
  await findDefaultWorkflowFields()
  await findGlobalFields()
}

const visible = ref(false)
function handleAdd() {
  visible.value = true
}


const updatePanelVisible = ref(false)
const sourceField = ref<ModelingFieldDefView>()
async function handleEditField(scope: FieldScope, row: ModelingFieldDefView) {
  if (scope === 'GLOBAL') {
    sourceField.value = row
    updatePanelVisible.value = true
  }
  else if (['ENTITY_DEFAULT', 'WORKFLOW_DEFAULT'].includes(scope)) {
    ElMessage.warning('默认字段无法编辑')
  }
}

async function handleDeleteField(scope: FieldScope, row: ModelingFieldDefView) {
  if (scope === 'GLOBAL') {
    const result = await deleteField(row.id)
    if (result) {
      await findGlobalFields()
    }
  }
  else if (['ENTITY_DEFAULT', 'WORKFLOW_DEFAULT'].includes(scope)) {
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