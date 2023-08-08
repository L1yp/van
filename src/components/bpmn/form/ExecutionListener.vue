<template>
  <div style="width: 100%; " v-loading="loading">
    <el-table
      height="400px"
      border stripe scrollbar-always-on
      :data="tableData"
    >
      <el-table-column v-if="bpmnSelectedElem?.type !== 'bpmn:SequenceFlow'" prop="event" label="事件" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="类型" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="value" label="值" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" width="120">
        <template #header>
          <el-button link text type="danger" @click="handleAddListener" :icon="Plus" />
        </template>
        <template #default="scope">
          <el-button link @click="handleEditListener(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" @click="handleDeleteListener(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <mask-window
      v-model="editPanelVisible"
      teleport-to="#execution-listener-panel"
      show-toolbar
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <ExecutionListenerForm ref="formRef" :listener="listenerObject!"/>
    </mask-window>
  </div>

</template>

<script lang="ts" setup>
import {computed, inject, onUnmounted, toRaw, ref, shallowRef} from "vue"
import {ElTable, ElTableColumn, ElDivider, ElButton, ElMessage} from "element-plus"
import emitter, { BpmnElementChanged, BpmnSelectionChanged } from '@/event/mitt'
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import ExecutionListenerForm from './ExecutionListenerForm.vue'
import { BpmnUtil } from "@/components/bpmn/form/util";
import { Plus } from '@element-plus/icons-vue'
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";


const bpmnSelectedElem = useBpmnSelectedElem()
const bpmnModeler = useBpmnModeler()

const loading = ref(false)
const formRef = ref<InstanceType<typeof ExecutionListenerForm>>()
const tableData = computed<ExecutionListenerObject[]>(() => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return []
  }

  const bo = selectedElem.businessObject
  let extensionElements = bo.extensionElements
  const listeners = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    return []
  }
  const data: ExecutionListenerObject[] = []
  if (listeners && listeners.length > 0) {
    for (let listener of listeners) {
      if (!listener.$type.endsWith("ExecutionListener")) {
        continue
      }
      let type: ListenerValueType | null = null;
      let val = null;
      if (listener.class) {
        type = "class"
        val = listener.class
      } else if (listener.expression) {
        type = "expression"
        val = listener.expression
      } else if (listener.delegateExpression) {
        type = "delegateExpression"
        val = listener.delegateExpression
      } else {
        continue
      }
      const fields: ListenerField[] = []
      if (listener.fields?.length) {
        for (const field of listener.fields) {
          let fieldType: ExecutionListenerFieldType | null = null
          let fieldVal = null
          if (field.string) {
            fieldType = 'string'
            fieldVal = field.string
          } else if (field.expression) {
            fieldType = 'expression'
            fieldVal = field.expression
          } else {
            continue
          }
          fields.push({
            name: field.name,
            type: fieldType,
            value: fieldVal
          })
        }
      }
      data.push({
        event: listener.event,
        type,
        value: val,
        fields,
      })
    }
  }
  console.log('execution listeners', data)
  return data
})

const originalListenerObject = shallowRef<ExecutionListenerObject>()
const listenerObject = ref<ExecutionListenerObject>()
const editPanelVisible = ref(false)
function handleEditListener(listener: ExecutionListenerObject) {
  listenerObject.value = listener
  originalListenerObject.value = JSON.parse(JSON.stringify(toRaw(listener)))
  editPanelVisible.value = true
}

function handleAddListener() {
  listenerObject.value = {
    event: 'start',
    type: 'class',
    value: '',
  }
  originalListenerObject.value = undefined
  editPanelVisible.value = true
}

const bpmnUtil = new BpmnUtil(bpmnModeler)
async function handleConfirm() {
  loading.value = true
  try {
    await formRef.value.validate()
  }
  catch (e) {
    // @ts-ignore
    const message = e.value?.map((it, idx) => `<div style="margin-bottom: ${idx === e.value.length - 1 ? '0' : '4'}px">${it.message}</div>`).join('')
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      duration: 6000,
      message,
    })
    console.error(e)
    return
  }
  finally {
    loading.value = false
  }

  if (!listenerObject.value) {
    return
  }


  const type = listenerObject.value.type
  if (type !== 'class') {
    listenerObject.value.fields = []
  }
  else {
    const names = new Set(listenerObject.value.fields?.map(it => it.name) || [])
    if (listenerObject.value.fields && names.size !== listenerObject.value.fields.length) {
      ElMessage.error('字段名不允许重复')
      return
    }

    if (listenerObject.value.fields?.some(it => !it?.name?.trim())) {
      ElMessage.error('请先填写字段名')
      return
    }

    if (listenerObject.value.fields?.some(it => !it?.value?.trim())) {
      ElMessage.error('请先填写字段值')
      return
    }


  }
  if (type === 'delegateExpression') {
    ElMessage.error('禁止使用delegateExpression')
    return
  }
  if (bpmnSelectedElem.value.type === 'bpmn:SequenceFlow') {
    listenerObject.value.event = undefined
  }

  console.log('处理后的监听器结构', listenerObject.value)

  console.log('tableData', tableData.value)
  const bo = bpmnSelectedElem.value.businessObject
  let extensionElements = bo.extensionElements
  if (!extensionElements) {
    extensionElements = bo.$model.create('bpmn:ExtensionElements', { values: [] })
  }
  // bo.$model.create('bpmn:Documentation', { text: val })
  const values: Array<any> = extensionElements.values


  let fields = undefined
  if (listenerObject.value?.fields?.length) {
    fields = []
    for (const field of listenerObject.value?.fields) {
      const bpmnField = bo.$model.create('flowable:Field', {
        name: field.name,
        [field.type]: field.value
      })
      fields.push(bpmnField)
    }
  }

  const executionListener = bo.$model.create('flowable:ExecutionListener', {
    event: listenerObject.value.event,
    [listenerObject.value.type]: listenerObject.value.value,
    fields,
  })

  if (originalListenerObject.value) {
    const listenerObj = originalListenerObject.value
    const index = values.findIndex(it => it.$type === 'flowable:ExecutionListener' && it.event === listenerObj.event && it[listenerObj.type] === listenerObj.value)
    if (index === -1) {
      throw new Error("找不到源监听器对象")
    }
    values[index] = executionListener
  } else {
    values.push(executionListener)
    bpmnUtil.updateProperty(bpmnSelectedElem, {
      extensionElements
    })
  }

  bpmnUtil.updateModelingProperty(bpmnSelectedElem, extensionElements, { values })

  editPanelVisible.value = false
}

function handleCancel() {
  tableData?.effect?.scheduler?.()
  editPanelVisible.value = false
}

function handleDeleteListener(listener: ExecutionListenerObject) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return
  }

  const bo = selectedElem.businessObject
  let extensionElements = bo.extensionElements
  const listeners: any[] = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    return
  }

  const idx = listeners.filter(it => it.$type.endsWith('ExecutionListener')).findIndex(it => it.event === listener.event && it[listener.type] === listener.value)
  if (idx !== -1) {
    listeners.splice(idx, 1)
    tableData?.effect?.scheduler?.()
  }


}

function handleElementChanged(event: BpmnElementChanged) {
  tableData?.effect?.scheduler?.()
}

function handleSelectionChanged(event: BpmnSelectionChanged) {
  editPanelVisible.value = false
}

emitter.on('bpmnElementChanged', handleElementChanged)
onUnmounted(() => emitter.off('bpmnElementChanged', handleElementChanged))

emitter.on('bpmnSelectionChanged', handleSelectionChanged)
onUnmounted(() => emitter.off('bpmnSelectionChanged', handleSelectionChanged))

</script>

<style scoped>
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
