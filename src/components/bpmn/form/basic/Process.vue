<template>
  <div class="field-item">
    <label>流程标识:&nbsp;</label>
    <el-input @change="val => handleInputChange('id', val)" v-model="key" clearable></el-input>
  </div>
  <div class="field-item">
    <label>流程名称:&nbsp;</label>
    <el-input @change="val => handleInputChange('name', val)" v-model="name" clearable></el-input>
  </div>
  <div class="field-item" style="margin-top: 8px">
    <label style="align-self: flex-start">流程描述:&nbsp;</label>
    <el-input @change="val => handleInputChange('description', val)" style="align-self: flex-start" :rows="1" type="textarea" v-model="description"></el-input>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch, computed, inject, toRaw, isProxy} from "vue"
import {ElInput} from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey} from "@/config/app.keys";
import {BpmnUtil} from "@/components/bpmn/form/util";

const innerWidth = "360px"
const labelWidth = "70px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`


const key = ref<string>()
const name = ref<string>()
const description = ref<string>()

const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
watch(bpmnSelectedElem, () => {
  console.info("process watch bpmnSelectedElem", bpmnSelectedElem.value)
  const businessObject = bpmnSelectedElem.value?.businessObject as BusinessObject
  key.value = businessObject?.id
  name.value = businessObject?.name
  if (businessObject?.documentation && businessObject?.documentation.length > 0) {
    description.value = businessObject?.documentation[0].text
  } else {
    description.value = ""
  }
}, {immediate: true})
// immediate的原因是 process和commonNode的切换是 V-IF 切换的时候 新的watch函数没法执行，
// 也可切换V-show解决这个问题，但是v-show不能多根节点

function handleInputChange(from: string, val: string) {
  const bpmnUtil: BpmnUtil = new BpmnUtil(toRaw(bpmnModeler.value))
  const selectedElem = toRaw(bpmnSelectedElem.value)
  console.log("isProxy", isProxy(bpmnSelectedElem.value), selectedElem)
  const businessObject = selectedElem?.businessObject! as BusinessObject
  if (["id", "name"].includes(from)) {
    const oldKey = businessObject[from]
    if (val !== oldKey) {
      bpmnUtil.updateProperty(selectedElem, {
        [from]: val
      })
    }
  }
  else if (from === "description") {
    const bo = selectedElem.businessObject
    const docs = bo.get("documentation")
    console.log("docs", docs)
    if (!docs || docs.length === 0) {
      const comment = bo.$model.create('bpmn:Documentation', { text: val });
      docs.push(comment)
    } else {
      docs[0].text = val
    }
  }
  console.log(from, val)
}


</script>

<style scoped>
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