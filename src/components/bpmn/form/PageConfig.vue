<template>
  <div style="padding: 10px" v-loading="loading">
    <el-select v-model="boundPageId" clearable>
      <el-option
        v-for="page in modulePageList"
        :label="page.name"
        :value="page.id"
        :key="page.id"
      />
    </el-select>
    <el-button text circle v-if="boundPageId" :icon="Setting" @click="handleUpdatePage" />
    <el-button text circle v-else :icon="Plus" @click="handleAddPage" />
    <el-button text circle :icon="Refresh" @click="handleRefreshPageList" />
    <mask-window v-model="visible" teleport-to="#workflow-mask-panel">
      <FormDesigner module="WORKFLOW" :mkey="workflowTypeVer.key" :name="pageName" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, toRaw, onUnmounted } from "vue"
import { ElRow, ElCol, ElInput, ElMessage, ElButton, ElSelect, ElOption } from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey, modelingPageKey, workflowVerKey} from "@/config/app.keys";
import { Plus, Setting, Refresh } from '@element-plus/icons-vue'
import { BpmnUtil } from "@/components/bpmn/form/util";
import emitter, { ElementChanged } from '@/event/mitt'
import {useModelingPageApi} from "@/service/modeling/page";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import FormDesigner from '@/views/process/form/designer.vue'


const bpmnSelectedElem = inject(bpmnSelectedElemKey);
const bpmnModeler = inject(bpmnModelerKey)
const modulePageList = inject(modelingPageKey)
const workflowTypeVer = inject(workflowVerKey)

const bpmnUtil = new BpmnUtil(bpmnModeler)

const boundPageId = computed({
  get() {
    const elem = toRaw(bpmnSelectedElem.value)
    if (!elem) {
      return null
    }
    const bo = elem.businessObject
    return bo.pageId || null
  },
  set(pageId) {
    bpmnUtil.updateProperty(bpmnSelectedElem, { pageId })
  }
})

const loading = ref(false)
const { pageList, findModulePages } = useModelingPageApi(loading)
function handleRefreshPageList() {
  findModulePages({ module: 'WORKFLOW', mkey: workflowTypeVer.value.key })
    .then(() => {
      modulePageList.value = pageList.value
    })
}

const pageName = ref('')
const visible = ref(false)
function handleAddPage() {
  pageName.value = ''
  visible.value = true
}

function handleUpdatePage() {
  const page = modulePageList.value.find(it => it.id === boundPageId.value)
  if (!page) {
    ElMessage.error('无效的表单选项，请刷新页面重新选择')
    return
  }
  pageName.value = page.name
  visible.value = true

}

function handleElementChanged(event: ElementChanged) {
  boundPageId.effect.scheduler()
}

emitter.on('elementChanged', handleElementChanged)

onUnmounted(() => emitter.off('elementChanged', handleElementChanged))
</script>

<style scoped>
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>