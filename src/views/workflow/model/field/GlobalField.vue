<template>
  <div style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px 0; ">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
    </div>
    <el-tabs v-model="scope" type="border-card" style="width: 100%; height: calc(100% - 32px - 12px);">
      <el-tab-pane name="DEFAULT" label="默认字段">
        <FieldTable :loading="loading" :data="defaultFields" />
      </el-tab-pane>
      <el-tab-pane name="GLOBAL" label="全局字段">
        <FieldTable :loading="loading" :data="globalFields" />
      </el-tab-pane>
    </el-tabs>
    <MaskWindow v-model="visible">
      <FieldAddPanel :scope="scope" @close="visible = false" @success="loadFields" />
    </MaskWindow>
  </div>
</template>
<script lang="ts" setup>
import { useWorkflowFieldApi } from "@/service/workflow/field";
import { ElTabs, ElTabPane, ElButton } from "element-plus";
import { onBeforeMount, provide, ref } from "vue";
import FieldTable from "./FieldTable.vue";
import { Plus } from "@element-plus/icons-vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import FieldAddPanel from "./FieldAddPanel.vue";
import { workflowDefKey } from "../keys";

const scope = ref<FieldScope>('DEFAULT')

const loading = ref(false)
const { defaultFields, findDefaultFields, globalFields, findGlobalFields } = useWorkflowFieldApi(loading)

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

</script>

<style scoped>
:deep(.el-tabs__content) {
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: calc(100%);
}
</style>