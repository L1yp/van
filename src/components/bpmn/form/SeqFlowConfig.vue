<template>
  <el-form label-width="80px">
    <el-form-item label="表达式" v-if="lineType === 'gateway'">
      <el-input v-model="expression" clearable />
    </el-form-item>
    <el-form-item label="序号" v-if="lineType === 'user' ">
      <el-input-number controls-position="right" v-model="orderNo" :min="1" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
// TODO: 设置 连线类型：默认流转 条件流程 无
import { inject, onUnmounted, computed } from "vue"
import { ElForm, ElFormItem, ElInput, ElInputNumber } from "element-plus"
import { bpmnModelerKey, bpmnSelectedElemKey } from "@/config/app.keys";
import emitter, { ElementChanged } from "@/event/mitt";
import { BpmnUtil } from "@/components/bpmn/form/util";

const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const bpmnUtil = new BpmnUtil(bpmnModeler)
const expression = computed({
  get() {
    return bpmnSelectedElem.value?.businessObject?.conditionExpression?.body || ''
  },
  set(v) {
    if (bpmnSelectedElem.value?.businessObject?.conditionExpression) {
      bpmnSelectedElem.value.businessObject.conditionExpression.body = v
    } else {
      const bpmnFactory = bpmnModeler.value.get("bpmnFactory")
      const conditionExpression = bpmnFactory.create('bpmn:FormalExpression')
      conditionExpression.body = v
      bpmnUtil.updateProperty(bpmnSelectedElem, { conditionExpression })
      expression.effect.scheduler()
    }
  }
})

const orderNo = computed({
  get() {
    return parseInt(bpmnSelectedElem.value?.businessObject?.order || '0') || 0
  },
  set(order) {
    bpmnUtil.updateProperty(bpmnSelectedElem, { order })
  }
})

const lineType = computed(() => {
  if (bpmnSelectedElem.value?.type !== 'bpmn:SequenceFlow') {
    return null
  }
  const source = bpmnSelectedElem.value?.source
  if (source?.type === 'bpmn:UserTask') {
    return 'user'
  } else if (source?.type === 'bpmn:ExclusiveGateway') {
    return 'gateway'
  }
  return null
})

function refreshState(e: ElementChanged) {
  expression.effect.scheduler()
  orderNo.effect.scheduler()
}

emitter.on('elementChanged', refreshState)
onUnmounted(() => emitter.off('elementChanged', refreshState))


</script>

<style scoped>
* {
  font-size: 14px;
}
</style>
