<template>
  <el-table
    :data="tableData"
  >
    <el-table-column prop="event" label="事件" width="70"></el-table-column>
    <el-table-column prop="type" label="类型" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="val" label="值" width="80" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-popover placement="left" trigger="hover" width="600px">
          <template #reference>
            <el-button size="small" circle><s-v-g-icon name="Info" style="width: 1em; height: 1em"/></el-button>
          </template>
          <el-descriptions title="监听详情" :column="1" border>
            <el-descriptions-item
              label="监听名称"
            >{{scope.row.id}}</el-descriptions-item>
            <el-descriptions-item label="监听类型">
              <el-tag v-text="typeDict[scope.row.type]"></el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="事件">{{scope.row.event}}</el-descriptions-item>
            <el-descriptions-item label="值">{{scope.row.val}}</el-descriptions-item>
          </el-descriptions>
        </el-popover>
        <el-button size="small" style="margin-left: 6px" circle><s-v-g-icon name="Plus" style="width: 1em; height: 1em"/></el-button>
        <el-popconfirm title="确定删除?" confirmButtonText="确定" cancelButtonText="取消" @confirm="deleteRow(scope.row)">
          <template #reference>
            <el-button size="small" circle style="margin-left: 6px"><s-v-g-icon name="Delete" style="width: 1em; height: 1em"/></el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import {ref, watch, computed, inject, toRaw} from "vue"
import {ElTable, ElTableColumn, ElPopover, ElDescriptions, ElDescriptionsItem, ElTag, ElPopconfirm, ElButton} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {bpmnModelerKey, bpmnSelectedElemKey} from "@/config/app.keys";

/**
 * <activiti:taskListener delegateExpression="${someJavaDelegateBean}" event="create" id="1180758402067910658" />
 */

interface TaskListenerModel {
  id: string;
  event: string;
  type: string;
  val: string;
}

const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    tableData.value = []
    return
  }
  let extensionElements = null
  if (selectedElem?.$type === "bpmn:Process") {
    extensionElements = selectedElem.extensionElements
  } else if (selectedElem?.type?.endsWith("Task")){
    const bo = toRaw(selectedElem.businessObject)
    extensionElements = bo.extensionElements
  } else {
    tableData.value = []
    return
  }
  const listeners = extensionElements?.get("values")

  if (listeners && listeners.length > 0) {
    const data = []
    for (let listener of listeners) {
      if (!listener.$type.endsWith("taskListener")) {
        continue
      }
      let type = null;
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
      }
      data.push({
        id: listener.id,
        event: listener.event,
        type: type,
        val: val,
      })
    }
    tableData.value = data
  }
})


const tableData = ref<TaskListenerModel[]>([
  // {
  //   id: "平台通用流程结束监听",
  //   event: "end",
  //   type: "class",
  //   val: "org.jeecg.modules.extbpm.listener.execution.ProcessEndListener",
  // }
])

const typeDict = {
  class: "类",
  expression: "表达式",
  delegateExpression: "代理表达式",
}


function deleteRow(row: TaskListenerModel) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    tableData.value = []
    return
  }
  let extensionElements = null
  if (selectedElem?.$type === "bpmn:Process") {
    extensionElements = selectedElem.extensionElements
  } else if (selectedElem?.type?.endsWith("Task")){
    const bo = toRaw(selectedElem.businessObject)
    extensionElements = bo.extensionElements
  } else {
    tableData.value = []
    return
  }
  const listeners: Array<any> = extensionElements?.get("values")

  if (listeners && listeners.length > 0) {
    const data = []
    let delIdx = -1
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      let type = null;
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
      }
      if (listener.event === row.event && listener.type === type && listener.val === val) {
        delIdx = i
        continue
      }
      data.push({
        id: listener.id,
        event: listener.event,
        type: type,
        val: val,
      })
    }
    if (delIdx === -1) {
      listeners.splice(delIdx, 1)
    }
    tableData.value = data
  }
}

</script>

<style scoped>

</style>