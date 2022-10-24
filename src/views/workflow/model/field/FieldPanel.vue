<template>
  <div v-loading="loading" style="background-color: #FFFFFF; width: 100%; height: 100%; box-sizing: border-box;">
    <div style="background-color: #F5F7FA; box-sizing: border-box; padding: 6px;">
      <div v-if="!refVisible">
        <el-button :icon="Plus" plain type="primary" @click="handleAddField">新增</el-button>
        <el-button :icon="Link" @click="handleRefField">引用</el-button>
        <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
      </div>
      <div v-else>
        <el-button plain type="primary" @click="handleConfirmRef">确定</el-button>
        <el-button @click="refVisible = false">取消</el-button>
      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 44px); ">
      <el-tabs v-if="!refVisible" type="border-card" style="height: 100%">
        <el-tab-pane label="私有字段">
          <field-table @edit="handleEditField" @delete="handleDeleteField" :loading="loading" :data="privateFields" />
        </el-tab-pane>
        <el-tab-pane label="公共字段">
          <field-table @delete="handleUnrefField" :loading="loading" :data="selectedGlabalFields" />
        </el-tab-pane>
        <el-tab-pane label="默认字段">
          <field-table :loading="loading" :data="defaultFields" />
        </el-tab-pane>
      </el-tabs>
      <div v-else>
        <el-form ref="formRef" :model="formData" label-width="100px">
          <el-form-item prop="field_id" label="全局字段" required>
            <el-select v-model="formData.field_id">
              <el-option 
                v-for="field in globalFields" 
                :key="field.id" 
                :label="field.label" 
                :value="field.id" 
                :disabled="selectedGlabalFields.map(it => it.id).includes(field.id)"
              />
            </el-select>
          </el-form-item>
        </el-form>

      </div>
    </div>

    <mask-window v-model="visible" teleport-to="#field-container">
      <field-add-panel @close="visible = false" @success="loadFields" />
    </mask-window>
    <mask-window v-model="updatePanelVisible" teleport-to="#field-container">
      <field-update-panel :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeMount, ref } from 'vue';
import { workflowDefKey } from '../keys';
import { ElButton, ElTabs, ElTabPane, ElSelect, ElOption, ElForm, ElFormItem } from "element-plus";
import { Plus, Link } from "@element-plus/icons-vue";
import MaskWindow from '@/components/dialog/MaskWindow.vue';
import FieldAddPanel from './FieldAddPanel.vue';
import { useWorkflowFieldApi } from '@/service/workflow/field';
import FieldTable from './FieldTable.vue';
import FieldUpdatePanel from './FieldUpdatePanel.vue';


const loading = ref<boolean>(false)
const visible = ref(false)
const src = inject(workflowDefKey)

const { 
  workflowFields, findWorkflowFields, 
  globalFields, findGlobalFields,
  refField, unrefField, deleteField,
} = useWorkflowFieldApi(loading)

const defaultFields = computed(() => workflowFields.value.filter(it => it.scope === 'DEFAULT'))
const privateFields = computed(() => workflowFields.value.filter(it => it.scope === 'PRIVATE'))
const selectedGlabalFields = computed(() => workflowFields.value.filter(it => it.scope === 'GLOBAL'))

onBeforeMount(loadFields)
function loadFields() {
  findWorkflowFields(src.value.key)
}


function handleAddField() {
  visible.value = true
}

const refVisible = ref(false)
async function handleRefField() {
  await findGlobalFields()
  refVisible.value = true
}

const formData = ref<WorkflowFieldRefParam>({
  wf_key: src.value.key,
  field_id: ''
})

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirmRef() {
  try {
    await formRef.value.validate()
  } catch (e) {
    return
  }

  const result = await refField(formData.value)
  if (result) {
    await loadFields()
    formData.value.field_id = ''
    refVisible.value = false
  }

}


const updatePanelVisible = ref(false)
const sourceField = ref<WorkflowFieldDefView>()
function handleEditField(row: WorkflowFieldDefView) {
  sourceField.value = row
  updatePanelVisible.value = true
}

async function handleDeleteField(row: WorkflowFieldDefView) {
  (await deleteField(row.id)) && loadFields()
}

async function handleUnrefField(row: WorkflowFieldDefView) {
  (await unrefField({wf_key: src.value.key, field_id: row.id})) && loadFields()
}

</script>

<style scoped>

</style>