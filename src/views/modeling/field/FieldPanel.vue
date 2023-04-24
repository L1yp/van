<template>
  <div v-loading="loading" style="background-color: var(--el-bg-color); width: 100%; height: 100%; box-sizing: border-box;">
    <div style="background-color: var(--toolbar-bg-color); box-sizing: border-box; padding: 6px;">
      <div v-if="!refVisible">
        <el-button :icon="Plus" plain type="primary" @click="handleAddField">新增</el-button>
        <el-button :icon="Link" @click="handleRefField">引用</el-button>
        <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
      </div>
      <div v-else>
        <el-button @click="refVisible = false">取消</el-button>
        <el-button plain type="primary" @click="handleConfirmRef">确定</el-button>
      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 44px); ">
      <el-tabs v-if="!refVisible" type="border-card" style="height: 100%">
        <el-tab-pane label="私有字段">
          <field-table @edit="handleEditField" @delete="handleDeleteField" :loading="loading" :data="privateFields" />
        </el-tab-pane>
        <el-tab-pane label="公共字段">
          <field-table @edit="handleEditGlobalField" @delete="handleUnrefField" :loading="loading" :data="selectedGlobalFields" />
        </el-tab-pane>
        <el-tab-pane label="默认字段">
          <field-table @edit="ElMessage.warning('默认字段不允许编辑')" @delete="ElMessage.error('默认字段不允许删除')" :loading="loading" :data="defaultFields" />
        </el-tab-pane>
      </el-tabs>
      <div v-else style="margin-top: 10px">
        <el-form ref="formRef" :model="formData" label-width="100px">
          <el-form-item prop="field_id" label="全局字段" required>
            <el-select v-model="formData.field_id">
              <el-option
                v-for="field in globalFields"
                :key="field.id"
                :label="field.label"
                :value="field.id"
                :disabled="selectedGlobalFields.map(it => it.id).includes(field.id)"
              />
            </el-select>
          </el-form-item>
        </el-form>

      </div>
    </div>

    <mask-window v-model="visible" teleport-to="#field-container">
      <field-add-panel v-bind="$props" @close="visible = false" @success="loadFields" />
    </mask-window>
    <mask-window v-model="updatePanelVisible" teleport-to="#field-container">
      <field-update-panel :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { ElButton, ElTabs, ElTabPane, ElSelect, ElOption, ElForm, ElFormItem, ElMessage } from "element-plus";
import { Plus, Link } from "@element-plus/icons-vue";
import MaskWindow from '@/components/dialog/MaskWindow.vue';
import FieldAddPanel from '@/views/modeling/field/FieldAddPanel.vue';
import { useModelingFieldApi } from '@/service/modeling/field';
import FieldTable from '@/views/modeling/field/FieldTable.vue';
import FieldUpdatePanel from '@/views/modeling/field/FieldUpdatePanel.vue';
import {useFieldStore} from "@/store/field-config";


const loading = ref<boolean>(false)
const visible = ref(false)

const store = useFieldStore()

const {
  modelingFields, findModelingFields,
  defaultEntityFields, findDefaultEntityFields,
  defaultWorkflowFields, findDefaultWorkflowFields,
  globalFields, findGlobalFields,
  refField, unrefField, deleteField,
} = useModelingFieldApi(loading)

const defaultFields = computed(() => {
  if (store.module === 'WORKFLOW') {
    return modelingFields.value.filter(it => it.scope === 'WORKFLOW_DEFAULT')
  } else {
    return modelingFields.value.filter(it => it.scope === 'ENTITY_DEFAULT')
  }
})
const privateFields = computed(() => {
  if (store.module === 'WORKFLOW') {
    return modelingFields.value.filter(it => it.scope === 'WORKFLOW_PRIVATE')
  } else {
    return modelingFields.value.filter(it => it.scope === 'ENTITY_PRIVATE')
  }
})

const selectedGlobalFields = computed(() => modelingFields.value.filter(it => it.scope === 'GLOBAL'))

onBeforeMount(loadFields)
function loadFields() {
  findModelingFields(store.module, store.mkey)
}


function handleAddField() {
  visible.value = true
}

const refVisible = ref(false)
async function handleRefField() {
  await findGlobalFields()
  refVisible.value = true
}

const formData = ref<ModelingFieldRefParam>({
  module: store.module,
  mkey: store.mkey,
  field_id: '',
})

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirmRef() {
  try {
    await formRef.value?.validate()
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
const sourceField = ref<ModelingFieldDefView>()
function handleEditField(row: ModelingFieldDefView) {
  sourceField.value = row
  console.log('update field', row)
  updatePanelVisible.value = true
}

async function handleDeleteField(row: ModelingFieldDefView) {
  (await deleteField(row.id)) && loadFields()
}

async function handleUnrefField(row: ModelingFieldDefView) {
  (await unrefField({module: store.module, mkey: store.mkey, field_id: row.id})) && loadFields()
}

function handleEditGlobalField() {
  ElMessage.warning('公共字段无法编辑')
}

</script>

<style scoped>
:deep(.el-tabs--border-card>.el-tabs__content) {
  box-sizing: border-box;
  height: calc(100% - 39px);
}
</style>