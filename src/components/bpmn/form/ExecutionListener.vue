<template>
  <el-table
    :data="tableData"
  >
    <el-table-column prop="event" label="事件" width="80"></el-table-column>
    <el-table-column prop="type" label="类型" width="80" show-overflow-tooltip></el-table-column>
    <el-table-column prop="val" label="值" width="90" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-popover placement="left" trigger="hover" width="600px">
          <template #reference>
            <el-button size="small" circle><s-v-g-icon name="Info" style="width: 1em; height: 1em"/></el-button>
          </template>
          <el-descriptions size="small" title="监听详情" :column="1" border>
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
        <el-button style="margin-left: 6px" size="small" circle><s-v-g-icon name="Plus" style="width: 1em; height: 1em"/></el-button>
        <el-popconfirm title="确定删除?" confirmButtonText="确定" cancelButtonText="取消" @confirm="deleteRow(scope.row)">
          <template #reference>
            <el-button circle size="small" style="margin-left: 6px"><s-v-g-icon name="Delete" style="width: 1em; height: 1em"/></el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import {inject, ref, toRaw, watch,} from "vue"
import {ElTable, ElTableColumn, ElPopover, ElDescriptions, ElDescriptionsItem, ElTag, ElPopconfirm, ElButton} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenKey} from "@/config/app.keys";

/**
 * <activiti:executionListener class="org.jeecg.modules.extbpm.listener.execution.ProcessEndListener" event="start" id="fkc68BdFdr6s3azj" />
 */
interface ExecListenerModel {
  id: string;
  event: string;
  type: string;
  val: string;
}
const propertyPanelOpen = inject(propertyPanelOpenKey)
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
      if (!listener.$type.endsWith("executionListener")) {
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


const tableData = ref<ExecListenerModel[]>([
  {
    id: "平台通用流程结束监听",
    event: "end",
    type: "class",
    val: "org.jeecg.modules.extbpm.listener.execution.ProcessEndListener",
  }
])

const typeDict = {
  class: "类",
  expression: "表达式",
  delegateExpression: "代理表达式",
}

function deleteRow(row: ExecListenerModel) {

}

</script>

<style scoped>

</style>