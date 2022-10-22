<template>
  <div v-loading="loading" style="background-color: #FFFFFF; width: 100%; height: 100%; box-sizing: border-box;">
    <div style="background-color: #F5F7FA; box-sizing: border-box; padding: 6px;">
      <el-button :icon="Plus" plain type="primary" @click="handleAddField">新增</el-button>
      <el-button :icon="Link" @click="handleRefField">引用</el-button>
    </div>
    <div style="width: 100%; height: calc(100% - 44px); ">
      <el-tabs type="border-card" style="height: 100%">
        <el-tab-pane label="私有字段">
          <field-table :loading="loading" :data="privateFields" />
        </el-tab-pane>
        <el-tab-pane label="公共字段">
          <field-table :loading="loading" :data="glabalFields" />
        </el-tab-pane>
        <el-tab-pane label="默认字段">
          <field-table :loading="loading" :data="defaultFields" />
        </el-tab-pane>
      </el-tabs>

    </div>

    <mask-window v-model="visible" teleport-to="#field-container">
      <field-add-panel @close="visible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeMount, ref } from 'vue';
import { workflowDefKey } from '../keys';
import { ElButton, ElTable, ElTableColumn, ElTabs, ElTabPane } from "element-plus";
import { Plus, Link } from "@element-plus/icons-vue";
import MaskWindow from '@/components/dialog/MaskWindow.vue';
import FieldAddPanel from './FieldAddPanel.vue';
import { useWorkflowFieldApi } from '@/service/workflow/field';
import FieldTable from './FieldTable.vue';


const loading = ref<boolean>(false)
const visible = ref(false)
const src = inject(workflowDefKey)

const { workflowFields, findWorkflowFields } = useWorkflowFieldApi(loading)

const defaultFields = computed(() => workflowFields.value.filter(it => it.scope === 'DEFAULT'))
const privateFields = computed(() => workflowFields.value.filter(it => it.scope === 'PRIVATE'))
const glabalFields = computed(() => workflowFields.value.filter(it => it.scope === 'GLOBAL'))

onBeforeMount(loadFields)
function loadFields() {
  findWorkflowFields(src.value.key)
}


function handleAddField() {
  visible.value = true
}

function handleRefField() {

}
</script>

<style scoped>

</style>