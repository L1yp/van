<template>
  <div style="width: 100%; " v-loading="loading">
    <el-form-item label="边界事件类型">
      <el-radio-group v-model="eventType">
        <el-radio-button value="bpmn:TimerEventDefinition">定时器事件</el-radio-button>
        <el-radio-button value="bpmn:ErrorEventDefinition">错误事件</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <template v-if="eventType === 'bpmn:TimerEventDefinition'">
      <timer-config/>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";
import { computed, onUnmounted, ref } from "vue";
import { ElFormItem, ElRadioGroup, ElRadioButton } from 'element-plus'
import { BpmnUtil } from "@/components/bpmn/form/util";
import TimerConfig from "@/components/bpmn/form/TimerConfig.vue";
import emitter, { BpmnElementChanged } from "@/event/mitt";

const bpmnModeler = useBpmnModeler()
const bpmnSelectedElem = useBpmnSelectedElem()

const bpmnUtil = new BpmnUtil(bpmnModeler)

const loading = ref(false)
const eventType = computed({
  get() {
    const elem = bpmnSelectedElem.value
    if (!elem || !elem.businessObject?.eventDefinitions?.length) {
      return ''
    }
    return elem.businessObject.eventDefinitions[0]?.$type
  },
  set(v) {
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject

    const timer = bpmnUtil.createElement(v, {}, bo)
    bpmnUtil.updateProperty(elem, {
      eventDefinitions: [
        timer
      ]
    })
    eventType.effect?.scheduler?.()
  }
})

function handleElementChanged(event: BpmnElementChanged) {
  eventType.effect?.scheduler?.()
}

emitter.on('bpmnElementChanged', handleElementChanged)
onUnmounted(() => emitter.off('bpmnElementChanged', handleElementChanged))
</script>