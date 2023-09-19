<template>
  <div style="width: 100%; " v-loading="loading">
    <el-form-item label="边界事件类型">
      <el-radio-group v-model="eventType">
        <el-radio-button label="bpmn:TimerEventDefinition">定时器事件</el-radio-button>
        <el-radio-button label="bpmn:ErrorEventDefinition">错误事件</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <template v-if="eventType === 'bpmn:TimerEventDefinition'">
      <el-form-item label="定时器类型">
        <el-radio-group v-model="timerType">
          <el-radio-button label="timeDate">指定时间</el-radio-button>
          <el-radio-button label="timeDuration">等待时长</el-radio-button>
          <el-radio-button label="timeCycle">重复周期</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="timerType === 'timeDate'" label="指定时间">
        <el-date-picker
          type="datetime"
          v-model="timeDate"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item v-if="timerType === 'timeDuration'" label="指定时长">
        <el-input v-model="timeDuration" />
      </el-form-item>
      <el-form-item v-if="timerType === 'timeCycle'" label="重复周期">
        <el-input v-model="timeCycle" />
      </el-form-item>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";
import { computed, ref } from "vue";
import { ElFormItem, ElRadioGroup, ElRadioButton, ElDatePicker, ElInput } from 'element-plus'
import { BpmnUtil } from "@/components/bpmn/form/util";

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

type TimerType = 'timeDate' | 'timeDuration' | 'timeCycle'
const timerType = computed<TimerType | undefined>({
  get() {
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const definition = bo.eventDefinitions[0]
    if (definition.timeDate) {
      return 'timeDate'
    }
    if (definition.timeDuration) {
      return 'timeDuration'
    }
    if (definition.timeCycle) {
      return 'timeCycle'
    }
  },
  set(val) {
    if (!val) {
      return
    }
    console.log('timeDate setter', val)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject

    const timer = bpmnUtil.createElement(eventType.value, {}, bo)
    const expression = bpmnUtil.createElement('bpmn:Expression', { body: '' }, timer)

    bpmnUtil.updateProperty(elem, {
      eventDefinitions: [
        timer
      ]
    })

    bpmnUtil.updateModelingProperty(elem, timer, {
      [val]: expression
    })

    timerType.effect?.scheduler?.()
  }
})
const timeDate = computed({
  get() {
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeDate?.body
  },
  set(v) {
    console.log('timeDate setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', { body: v }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeDate: expression
    })
    timeDate.effect?.scheduler?.()
  }
})
const timeDuration = computed({
  get() {
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeDuration?.body
  },
  set(v) {
    console.log('timeDuration setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', { body: v }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeDuration: expression
    })
    timeDuration.effect?.scheduler?.()
  }
})
const timeCycle = computed({
  get() {
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeCycle?.body
  },
  set(v) {
    console.log('timeCycle setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', { body: v }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeCycle: expression
    })
    timeCycle.effect?.scheduler?.()
  }
})

</script>