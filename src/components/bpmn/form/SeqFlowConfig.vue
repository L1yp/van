<template>
  <div class="container">
    <div class="field-item">
      <label>表达式:&nbsp;</label>
      <el-input style="width: 100%" @change="handleInputChange" v-model="expression"></el-input>
    </div>
    <div class="field-item">
      <label>序号:&nbsp;</label>
      <el-input style="width: 100%" @change="handleOrderNoInputChange" v-model="orderNo"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: 设置 连线类型：默认流转 条件流程 无
import {ref, watch, inject, toRaw, nextTick} from "vue"
import {ElInput} from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenedKey} from "@/config/app.keys";

const expression = ref("")
const orderNo = ref<string>('')

const innerWidth = "360px"
const labelWidth = "60px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`


const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const propertyPanelOpen = inject(propertyPanelOpenedKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem?.businessObject)
  if (!bo || !bo?.conditionExpression) {
    expression.value = ""
    return
  }
  expression.value = bo?.conditionExpression?.body
  orderNo.value = bo.order

  if (bo?.$type === 'bpmn:SequenceFlow') {
    // 由于computed show seq-flow-config 晚于 此watch函数会导致无法展开，因此需要将open延迟
    nextTick(() => propertyPanelOpen.value = 'flow-condition')
  }
})

function handleInputChange(val: string) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem.businessObject)
  const bpmnFactory = bpmnModeler.value.get("bpmnFactory")
  const expression = bpmnFactory.create('bpmn:FormalExpression');
  expression.body = val

  const modeling = bpmnModeler.value.get("modeling")
  modeling.updateProperties(selectedElem, {
    conditionExpression: expression
  })
}

function handleOrderNoInputChange(val: string) {
  const modeling = bpmnModeler.value.get("modeling")
  const selectedElem = toRaw(bpmnSelectedElem.value)

  modeling.updateProperties(selectedElem, {
    order: val
  })

}


</script>

<style scoped>
* {
  font-size: 14px;
}

.container {
  display: flex;
  flex-direction: column;
}

.field-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
}


.field-item label {
  width: v-bind(labelWidth);
  text-align: right;
}

:deep(.el-input) {
  width: v-bind(inputWidth)
}

:deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: v-bind(inputWidth);
}

</style>
