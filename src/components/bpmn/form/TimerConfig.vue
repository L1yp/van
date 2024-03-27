<template>
  <el-form-item label="定时器类型">
    <el-radio-group v-model="timerType">
      <el-radio-button value="timeDate">指定时间</el-radio-button>
      <el-radio-button value="timeDuration">等待时长</el-radio-button>
      <el-radio-button value="timeCycle">重复周期</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item v-if="timerType === 'timeDate'" label="指定时间">
    <el-date-picker
      type="datetime"
      v-model="timeDate"
      value-format="YYYY-MM-DDTHH:mm:ssZ"
      style="width: 100%"
    />
  </el-form-item>
  <el-form-item v-if="timerType === 'timeDuration'" label="指定时长">
    <iso-date-picker v-model="timeDuration" type="duration"/>
  </el-form-item>
  <el-form-item v-if="timerType === 'timeCycle'" label="重复周期">
    <iso-date-picker v-model="timeCycle" type="cycle"/>
  </el-form-item>
  <el-form-item v-if="timerType === 'timeCycle'" label="结束时间">
    <el-date-picker
      type="datetime"
      v-model="timeCycleEndDate"
      value-format="YYYY-MM-DDTHH:mm:ssZ"
      style="width: 100%"
      clearable
    />
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElDatePicker, ElFormItem, ElRadioButton, ElRadioGroup } from "element-plus";
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";
import { BpmnUtil } from "@/components/bpmn/form/util";
import { computed, onUnmounted, ref } from "vue";
import emitter, { BpmnElementChanged } from "@/event/mitt";
import IsoDatePicker from "@/components/iso8601/IsoDatePicker.vue";


const bpmnModeler = useBpmnModeler()
const bpmnSelectedElem = useBpmnSelectedElem()

const bpmnUtil = new BpmnUtil(bpmnModeler)

const loading = ref(false)
const eventTypeKey = ref(1)
const eventType = computed({
  get() {
    const depKey = eventTypeKey.value
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
    eventTypeKey.value++
  }
})

const timerTypeKey = ref(1)
const timeDataKey = ref(1)
const timeDurationKey = ref(1)
const timeCycleKey = ref(1)
const timeCycleEndDateKey = ref(1)
type TimerType = 'timeDate' | 'timeDuration' | 'timeCycle'
const timerType = computed<TimerType | undefined>({
  get() {
    const depKey = timerTypeKey.value
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
    timerTypeKey.value++
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

  }
})
const timeDate = computed({
  get() {
    const depKey = timeDataKey.value
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
    timeDataKey.value++
  }
})
const timeDuration = computed({
  get() {
    const depKey = timeDurationKey.value
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeDuration?.body?.substring(1)
  },
  set(v) {
    timeDurationKey.value++
    console.log('timeDuration setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', { body: 'P' + v }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeDuration: expression
    })
  }
})
const timeCycle = computed({
  get() {
    const depKey = timeCycleKey.value
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeCycle?.body?.substring(1)
  },
  set(v) {
    timeCycleKey.value++
    console.log('timeCycle setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', {
      body: 'R' + v,
      'flowable:endDate': timer?.timeCycle?.$attrs?.['flowable:endDate']
    }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeCycle: expression,

    })
  }
})

const timeCycleEndDate = computed({
  get() {
    const depKey = timeCycleEndDateKey.value
    return bpmnSelectedElem.value?.businessObject?.eventDefinitions?.[0]?.timeCycle?.$attrs?.['flowable:endDate']
  },
  set(v) {
    timeCycleEndDateKey.value++
    console.log('timeCycle setter', v)
    const elem = bpmnSelectedElem.value
    const bo = elem.businessObject
    const timer = bo.eventDefinitions[0]

    const expression = bpmnUtil.createElement('bpmn:Expression', {
      body: timer.timeCycle.body,
      'flowable:endDate': v
    }, timer)

    bpmnUtil.updateModelingProperty(elem, timer, {
      timeCycle: expression
    })
  }
})




function handleElementChanged(event: BpmnElementChanged) {
  eventTypeKey.value++
  timerTypeKey.value++
  timeDataKey.value++
  timeDurationKey.value++
  timeCycleKey.value++
  timeCycleEndDateKey.value++
}

emitter.on('bpmnElementChanged', handleElementChanged)
onUnmounted(() => emitter.off('bpmnElementChanged', handleElementChanged))
</script>
