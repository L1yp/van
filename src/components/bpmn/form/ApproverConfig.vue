<template>
  <el-form label-width="80px" label-position="right">
    <el-form-item label="开启会签">
      <el-switch
        v-model="openMultiInstance"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; "
      />
    </el-form-item>
    <el-form-item label="模式" v-if="openMultiInstance">
      <el-radio-group v-model="isSequential">
        <el-radio-button :label="true">串行</el-radio-button>
        <el-radio-button :label="false">并行</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="assigneeType" style="width: 100%" :disabled="openMultiInstance || true">
        <el-option label="用户" value="user" />
        <el-option label="部门" value="dept" />
        <el-option label="角色" value="role" />
      </el-select>
    </el-form-item>
    <el-form-item label="审核人">
      <el-select v-model="assigneeValue" multiple :multiple-limit="multipleLimit" style="width: 100%">
        <el-option v-for="field in userFields" :key="field.id" :label="field.label" :value="field.field" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
// 会签配置
import { computed, inject, toRaw, onUnmounted } from "vue"
import { ElSelect, ElOption, ElForm, ElFormItem, ElSwitch, ElRadioGroup, ElRadioButton } from "element-plus"
import {
  modelingFieldKey,
} from "@/config/app.keys";
import { BpmnUtil } from "@/components/bpmn/form/util";
import emitter, { BpmnElementChanged } from "@/event/mitt";
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

const modelingFields = inject(modelingFieldKey)!
const bpmnSelectedElem = useBpmnSelectedElem()
const bpmnModeler = useBpmnModeler()
const userFields = computed(() => modelingFields.value.filter(it => it.type === 'user'))


type AssigneeType = 'user' | 'dept' | 'role'

const bpmnUtil = new BpmnUtil(bpmnModeler)


const openMultiInstance = computed({
  get() {
    const elem = toRaw(bpmnSelectedElem.value)
    if (!elem || !elem.businessObject) {
      return false
    }
    return !!elem.businessObject?.loopCharacteristics
  },
  set(v) {
    if (!bpmnModeler.value) {
      return
    }
    const bpmnFactory = bpmnModeler.value.get<BpmnFactory>("bpmnFactory")
    if (v) {
      const multiInstanceLoopCharacteristics = bpmnFactory.create('bpmn:MultiInstanceLoopCharacteristics')
      multiInstanceLoopCharacteristics.isSequential = true
      multiInstanceLoopCharacteristics.elementVariable = 'assigneeItem'
      const fields = assigneeValue.value?.join(',') || ''
      multiInstanceLoopCharacteristics.collection = '${psr.readList(execution, "' + bpmnUtil.getProcessKey() + '", "' + fields + '")}'

      multiInstanceLoopCharacteristics.completionCondition = bpmnFactory.create('bpmn:FormalExpression')
      multiInstanceLoopCharacteristics.completionCondition.body = '${completionStrategy.isCompletion(execution)}'


      bpmnUtil.updateProperty(bpmnSelectedElem.value, {
        loopCharacteristics: multiInstanceLoopCharacteristics
      })
      bpmnUtil.updateProperty(bpmnSelectedElem, {
        assignee: '${assigneeItem}'
      })
      // <bpmn2:completionCondition xsi:type="bpmn2:tFormalExpression">1111</bpmn2:completionCondition>
      assigneeType.value = 'user'
      const outgoing = bpmnSelectedElem.value.outgoing
      for (let connection of outgoing) {
        if (!connection.businessObject.completionRule) {
          bpmnUtil.updateProperty(connection, { completionRule: 'all' })
        }
      }
    } else {
      if (assigneeValue.value?.length > 1) {
        assigneeValue.value = [assigneeValue.value[0]]
      }
      multipleLimit?.effect?.scheduler?.()
      bpmnUtil.updateProperty(bpmnSelectedElem!.value, {
        loopCharacteristics: undefined,
        assignee: '${psr.read(execution, "' + bpmnUtil.getProcessKey() + '", "' + assigneeValue.value.join(',') + '")}'
      })
    }
  }
})

const isSequential = computed({
  get() {
    const elem = toRaw(bpmnSelectedElem!.value)
    if (!elem || !elem.businessObject) {
      return false
    }
    return !!elem.businessObject?.loopCharacteristics?.isSequential || false
  },
  set(v) {
    const elem = toRaw(bpmnSelectedElem!.value)
    bpmnUtil.updateModelingProperty(bpmnSelectedElem, elem.businessObject.loopCharacteristics, {
      isSequential: v
    })
  }
})


const assigneeType = computed<AssigneeType>({
  get() {
    const elem = toRaw(bpmnSelectedElem!.value)
    // FIXME: unsupported other type
    if (true || !elem || !elem.businessObject || bpmnUtil.isMultiInstanceUserTask(bpmnSelectedElem)) {
      return 'user'
    }
    const bo = elem.businessObject

    return bo.assigneeType
  },
  set(v) {
    bpmnUtil.updateProperty(bpmnSelectedElem!.value, {
      assigneeType: v
    })
  }
})

const assigneeValue = computed<string[]>({
  get() {
    const elem = toRaw(bpmnSelectedElem!.value)
    if (!elem || !elem.businessObject) {
      return []
    }
    const bo = elem.businessObject
    const fields: string = bo?.['assigneeFields']
    if (!fields) {
      return []
    }
    return fields.split(',')
  },
  set(v) {
    bpmnUtil.updateProperty(bpmnSelectedElem, {
      assigneeFields: v.join(',')
    })
    if (bpmnUtil.isMultiInstanceUserTask(bpmnSelectedElem)) {
      bpmnUtil.updateModelingProperty(bpmnSelectedElem, bpmnSelectedElem!.value?.businessObject?.loopCharacteristics, {
        collection: '${psr.readList(execution, "' + bpmnUtil.getProcessKey() + '", "' + v.join(',') + '")}'
      })
      bpmnUtil.updateProperty(bpmnSelectedElem, {
        assignee: '${assigneeItem}'
      })
    } else {
      bpmnUtil.updateProperty(bpmnSelectedElem, {
        assignee: '${psr.read(execution, "' + bpmnUtil.getProcessKey() + '", "' + v.join(',') + '")}'
      })
    }
  }
})

const multipleLimit = computed(() => {
  const elem = toRaw(bpmnSelectedElem.value)
  if(!elem) {
    return 1
  }
  const bo = elem.businessObject
  console.log('computed multiple bo', bo);

  if (bo.loopCharacteristics) {
    return 0
  }
  return 1
})

function refreshState(e: BpmnElementChanged) {
  const elem = e.element
  if (elem.type === 'bpmn:UserTask') {
    multipleLimit.effect.scheduler?.()
    isSequential.effect.scheduler?.()
    openMultiInstance.effect.scheduler?.()

    assigneeType.effect.scheduler?.()
    assigneeValue.effect.scheduler?.()
  }
}

emitter.on('bpmnElementChanged', refreshState)

onUnmounted(() => emitter.off('bpmnElementChanged', refreshState))
</script>

<style scoped>
* {
  font-size: 14px;
}
</style>
