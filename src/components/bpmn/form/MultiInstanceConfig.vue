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
      <el-select v-model="formData.collection" @change="val => handleChangeInput('collection', val)" value-key="id">
        <el-option
          v-for="item in collectionOptions"
          :key="item.id"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
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
import {inject, nextTick, ref, toRaw, watch} from "vue"
import {ElAlert, ElInput, ElOption, ElSelect} from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey, dictValuesKey, processModelFieldKey} from "@/config/app.keys";
import {useRoute} from "vue-router";

const route = useRoute()
const processKey = route.query.processKey as string


interface FormModel {
  type: number;
  loopCount?: string;
  collection?: SelectModel;
  item?: string;
  condition?: string;
}

interface SelectModel {
  id: number;
  label: string;
  value?: ProcessFieldDefinition | string;
}

const formData = ref<FormModel>({
  type: 1
})

const collectionOptions = ref<SelectModel[]>([])

const dictValues = inject(dictValuesKey)
const processModelFields = inject(processModelFieldKey)
let valMap = null;
watch(processModelFields, () => {
  if (!processModelFields.value || processModelFields.value.length === 0) {
    return;
  }
  valMap = new Map<number, string>(toRaw(dictValues.value).filter(it => it.scope === "global" && it.ident === "component_type").map(it => [it.val, it.label]));
  collectionOptions.value = toRaw(processModelFields.value)
    .filter(it => it.component_type === 7)
    .map(it => {
      return {
        id: it.id,
        label: it.label + `(${valMap.get(it.component_type)})`,
        value: it
      }
    }) as SelectModel[]
  console.log("toRaw collectionOptions", toRaw(collectionOptions.value))
})

const bpmnSelectedElem = inject(bpmnSelectedElemKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return
  }
  if (selectedElem?.type === "bpmn:UserTask") {
    const bo = selectedElem.businessObject
    if (bo.loopCharacteristics) {
      if (bo.loopCharacteristics?.isSequential) {
        formData.value.type = 3
      } else {
        formData.value.type = 2
      }
      if (bo.loopCharacteristics?.collection) {
        const val = bo.loopCharacteristics?.collection
        if (val.startsWith("${psr.read")) {
          // custom field
          const idx = val.indexOf("', '")
          const lastIdx = val.indexOf("'", idx + 4);
          const field = val.substring(idx + 4, lastIdx)
          if (processModelFields.value) {
            const fields = toRaw(processModelFields.value)
            for (let item of fields) {
              if (item.name === field) {
                formData.value.collection = {
                  id: item.id,
                  label: item.label + `(${valMap?.get(item.component_type)})`,
                  value: item
                }
                break;
              }
            }
          }
          console.log("field", field)
        }
      } else {
        formData.value.collection = null
      }
      if (bo.loopCharacteristics?.elementVariable) {
        formData.value.item = bo.loopCharacteristics?.elementVariable
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
    "flowable:collection": "${psr.read('" + processKey + "', '" + (formData.value.collection.value as ProcessFieldDefinition).name + "', execution)}" ,
  })

  const canvas = bpmnModeler.value.get("canvas")
  bpmnSelectedElem.value = canvas.getRootElement()
  nextTick(() => bpmnSelectedElem.value = selectedElem)

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
