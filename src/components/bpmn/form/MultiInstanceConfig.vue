<template>
  <div class="container">
    <div class="field-item">
      <label>会签类型:&nbsp;</label>
      <el-select @change="val => handleChangeInput('type', val)" v-model="formData.type">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-show="formData.type !== 1" class="field-item">
      <label>循环数量:&nbsp;</label>
      <el-input @change="val => handleChangeInput('loopCount', val)"  v-model="formData.loopCount"></el-input>
    </div>
    <div v-show="formData.type !== 1" class="field-item">
      <label>循环集合:&nbsp;</label>
      <el-input @change="val => handleChangeInput('collection', val)" v-model="formData.collection"></el-input>
    </div>
    <div v-show="formData.type !== 1" class="field-item">
      <label>元素变量:&nbsp;</label>
      <el-input @change="val => handleChangeInput('item', val)" v-model="formData.item"></el-input>
    </div>
    <div v-show="formData.type !== 1" class="field-item">
      <label>完成条件:&nbsp;</label>
      <el-input @change="val => handleChangeInput('condition', val)" v-model="formData.condition"></el-input>
    </div>

    <el-alert
      style="margin-top: 10px"
      title="配置说明"
      :closable="false"
      type="warning"
    >
      <template #default>
        <p>1.${flowUtil.stringToList(assigneeUserIdList)},将字符串转换成集合,暴露的SpringBean方法</p>
        <p>2.多实例默认创建3个流程变量,nrOfInstances:实例总数,nrOfActiveInstances:当前活跃的(当前还未完成的),对于顺序的多实例,此值总是1,nrOfCompletedInstances:已完成的实例个数。例:${nrOfCompletedInstances/nrOfInstances>=0.6} 说明当有60%的任务完成时，会完成此多实例，删除其他未完成的，继续下面的流程。</p>
        <p>3.不启动多实例,则只会创建一个任务，默认不启动，不启动多实例，配置都无效</p>
      </template>
    </el-alert>

  </div>
</template>

<script lang="ts" setup>
// 会签配置
import {ref, watch, computed, inject, toRaw} from "vue"
import {ElSelect, ElOption, ElInput, ElAlert} from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey} from "@/config/app.keys";
import {BpmnUtil} from "@/components/bpmn/form/util";

interface FormModel {
  type: number;
  loopCount?: string;
  collection?: string;
  item?: string;
  condition?: string;
}

const formData = ref<FormModel>({
  type: 1
})

const bpmnSelectedElem = inject(bpmnSelectedElemKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return
  }
  let extensionElements = null
  if (selectedElem?.type === "bpmn:UserTask") {
    const bo = selectedElem.businessObject
    if (bo.loopCharacteristics) {
      if (bo.loopCharacteristics?.isSequential) {
        formData.value.type = 3
      } else {
        formData.value.type = 2
      }
      if (BpmnUtil.hasAttrIgnorePrefix(bo.loopCharacteristics?.$attrs, "collection")) {
        formData.value.collection = BpmnUtil.getAttrIgnorePrefix(bo.loopCharacteristics?.$attrs, "collection")
      } else {
        formData.value.collection = ""
      }
      if (BpmnUtil.hasAttrIgnorePrefix(bo.loopCharacteristics?.$attrs, "elementVariable")) {
        formData.value.item = BpmnUtil.getAttrIgnorePrefix(bo.loopCharacteristics?.$attrs, "elementVariable")
      } else {
        formData.value.item = null
      }
      if (bo.loopCharacteristics?.loopCardinality?.body) {
        formData.value.loopCount = bo.loopCharacteristics?.loopCardinality?.body
      } else {
        formData.value.loopCount = ""
      }

      if (bo.loopCharacteristics?.completionCondition?.body) {
        formData.value.condition = bo.loopCharacteristics?.completionCondition?.body
      } else {
        formData.value.condition = ""
      }
    } else {
      formData.value = {
        type: 1
      }
    }
  }
}, {immediate: true})

const options = [
  {
    label: "无",
    value: 1
  },
  {
    label: "并行多重事件",
    value: 2
  },
  {
    label: "顺序多重事件",
    value: 3
  },
]

const bpmnModeler = inject(bpmnModelerKey)
function handleChangeInput(type: string, val: number | string) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bpmnFactory = bpmnModeler.value.get("bpmnFactory")
  const modeling = bpmnModeler.value.get('modeling')
  const multiInstanceLoopCharacteristics = bpmnFactory.create('bpmn:MultiInstanceLoopCharacteristics');
  if (type === 'type') {
    const idx = val as number
    if (idx === 3) {
      multiInstanceLoopCharacteristics.isSequential = true
    } else if (idx === 1) {
      modeling.updateProperties(selectedElem, {
        loopCharacteristics: null
      });
      return
    }
  }

  if (formData.value.loopCount) {
    if (!multiInstanceLoopCharacteristics.loopCardinality) {
      multiInstanceLoopCharacteristics.loopCardinality = bpmnFactory.create('bpmn:FormalExpression');
    }
    multiInstanceLoopCharacteristics.loopCardinality.body = formData.value.loopCount
  }
  if (formData.value.condition) {
    if (!multiInstanceLoopCharacteristics.completionCondition) {
      multiInstanceLoopCharacteristics.completionCondition = bpmnFactory.create('bpmn:FormalExpression');
    }
    multiInstanceLoopCharacteristics.completionCondition.body = formData.value.condition
  }
  modeling.updateProperties(selectedElem, {
    loopCharacteristics: multiInstanceLoopCharacteristics
  });

  modeling.updateModdleProperties(selectedElem, multiInstanceLoopCharacteristics, {
    "flowable:elementVariable": formData.value.item,
    "flowable:collection": formData.value.collection,
  })

}

const innerWidth = "360px"
const labelWidth = "80px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`

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

:deep(.el-textarea) {
  width: v-bind(inputWidth)
}

:deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: v-bind(inputWidth);
}

</style>