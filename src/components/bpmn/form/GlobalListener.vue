<template>
  <el-table
    :data="tableData"
  >
    <el-table-column prop="val" label="值" width="250" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" circle><s-v-g-icon name="Plus" style="width: 1em; height: 1em"/></el-button>

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
import {ElTable, ElTableColumn, ElPopconfirm, ElButton, ElMessage} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {bpmnSelectedElemKey} from "@/config/app.keys";

/**
 * <activiti:eventListener class="org.jeecg.modules.extbpm.listener.execution.ProcessEndListener" />
 */
interface GlobalListenerModel {
  val: string;
}

const tableData = ref<GlobalListenerModel[]>([])

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
  } else {
    const bo = toRaw(selectedElem.businessObject)
    extensionElements = bo.extensionElements
  }
  const listeners = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    tableData.value = []
    return
  }

  if (listeners && listeners.length > 0) {
    const data = []
    for (let listener of listeners) {
      if (!listener.$type.endsWith("eventListener")) {
        continue
      }
      data.push({
        val: listener.class
      })
    }
    tableData.value = data
  }
})


function deleteRow(row: GlobalListenerModel) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    tableData.value = []
    return
  }
  let extensionElements = null
  if (selectedElem?.$type === "bpmn:Process") {
    extensionElements = selectedElem.extensionElements
  } else {
    const bo = toRaw(selectedElem.businessObject)
    extensionElements = bo.extensionElements
  }
  const listeners: Array<any> = extensionElements?.get("values")
  console.log("listeners", listeners)
  if (!listeners || listeners.length === 0) {
    tableData.value = []
    return
  }

  if (listeners && listeners.length > 0) {
    const data = []
    let delIdx = -1;
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].class === row.val) {
        delIdx = i;
        break;
      }
    }

    if (delIdx !== -1) {
      listeners.splice(delIdx, 1);
    }

    for (let listener of listeners) {
      if (!listener.$type.endsWith("eventListener")) {
        continue
      }
      data.push({
        val: listener.class
      })
    }
    tableData.value = data
  }
}

</script>

<style scoped>

</style>