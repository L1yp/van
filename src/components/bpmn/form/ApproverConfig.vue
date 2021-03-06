<template>
  <div class="container">
    <div class="field-item">
      <label>字段:&nbsp;</label>
      <el-select v-model="expression" @change="handleInputChange" value-key="id" clearable>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
    </div>

  </div>
</template>

<script lang="ts" setup>
// 会签配置
import {ref, watch, computed, inject, toRaw} from "vue"
import {ElSelect, ElOption, ElInput, } from "element-plus"
import {
  bpmnModelerKey,
  bpmnSelectedElemKey,
  dictValuesKey,
  processModelFieldKey,
  propertyPanelOpenedKey
} from "@/config/app.keys";
import {BpmnUtil} from "@/components/bpmn/form/util";

const expression = ref<SelectModel>()

const innerWidth = "360px"
const labelWidth = "60px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`

const processModelFields = inject(processModelFieldKey)
const dictValues = inject(dictValuesKey)

const options = ref<SelectModel[]>([])

console.log("approveConfig setup init processModelFields", processModelFields.value)
let valMap = null;
watch(processModelFields, () => {
  if (!processModelFields.value || processModelFields.value.length === 0) {
    return;
  }
  valMap = new Map<number, string>(toRaw(dictValues.value).filter(it => it.scope === "global" && it.ident === "component_type").map(it => [it.val, it.label]));
  options.value = toRaw(processModelFields.value)
    .filter(it => [6, 7].includes(it.component_type))
    .map(it => {
      return {
        id: it.id,
        label: it.label + `(${valMap.get(it.component_type)})`,
        value: it
      }
    }) as SelectModel[]
  console.log("toRaw options", toRaw(options.value))
})

/**
 * 初始化 流程创建者(id=-1) 会签多实例(id=-2)的 审批人设置
 */
function initExtOptions() {
  if (!bpmnModeler.value) return
  const startArr: any[] = bpmnModeler.value.get("elementRegistry").filter(it => it.type === "bpmn:StartEvent")
  if (startArr) {
    if (startArr.length > 1) {
      console.error("存在多个startEvent节点")
    } else if (startArr.length === 1) {
      const startEvent = startArr[0]
      const initiator = startEvent?.businessObject?.initiator
      const creatorArr = options.value.filter(it => it.id === -1)
      if (!creatorArr || creatorArr.length === 0) {
        options.value.push({
          id: -1,
          label: `流程创建者(${initiator})`,
          value: "${" + initiator + "}"
        })
      }
    }
  }
}

interface SelectModel {
  id: number;
  label: string;
  value?: ProcessFieldDefinition | string;
}

const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const propertyPanelOpen = inject(propertyPanelOpenedKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem?.businessObject)
  initExtOptions()
  let elementVariable = ''
  if (bo?.loopCharacteristics) {
    elementVariable = bo?.loopCharacteristics?.elementVariable
    const multiInstance = options.value.find(it => it.id === -2)
    if (multiInstance) {
      multiInstance.label = `会签审核(${elementVariable})`
      multiInstance.value = "${" + elementVariable + "}"
    } else {
      options.value.push({
        id: -2,
        label: `会签审核(${elementVariable})`,
        value: "${" + elementVariable + "}"
      })
    }
  }

  if (bo?.assignee) {
    const val = bo?.assignee
    if (val.startsWith("${psr.read")) {
      // custom field
      const idx = val.indexOf("', '")
      const lastIdx = val.indexOf("'", idx + 4);
      const field = val.substring(idx + 4, lastIdx)
      if (processModelFields.value) {
        const fields = toRaw(processModelFields.value)
        for (let item of fields) {
          if (item.name === field) {
            expression.value = {
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
    else {
      // creator multi instance config
      if (val === ("${" + elementVariable + "}")) {
        expression.value = {
          id: -2,
          label: `会签审核(${elementVariable})`,
          value: val as string
        }
      } else {
        expression.value = {
          id: -1,
          label: `流程创建者`,
          value: val as string
        }
      }

    }
  }

  // init expression
  if (!['owner', 'page', 'multi-instance'].includes(propertyPanelOpen.value)) {
    propertyPanelOpen.value = 'owner'
  }

})

function handleInputChange() {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem.businessObject)
  if (!bo) return
  const bpmnUtil: BpmnUtil = new BpmnUtil(toRaw(bpmnModeler.value))
  if (expression.value.id > 0) {
    const val = expression.value.value as ProcessFieldDefinition;
    const processKey = val.process_key
    const field = val.name
    bpmnUtil.updateProperty(selectedElem, {
      "flowable:assignee": "${psr.read('" + processKey + "', '" + field + "', execution)}"
    })
  } else {
    // creator or multi instance item
    const val = expression.value.value as string;
    bpmnUtil.updateProperty(selectedElem, {
      "flowable:assignee": val
    })
  }

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
