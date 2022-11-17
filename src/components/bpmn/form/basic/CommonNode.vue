<template>
  <el-form label-width="80px" label-position="right">
    <el-form-item label="节点类型">
      <el-input disabled v-model="type" clearable style="width: 100%;" />
    </el-form-item>
    <el-form-item label="节点标识">
      <el-input disabled v-model="key" clearable style="width: 100%;"/>
    </el-form-item>
    <el-form-item label="节点名称">
      <el-input disabled v-model="name" clearable style="width: 100%;"/>
    </el-form-item>
    <el-form-item label="节点描述">
      <el-input style="width: 100%; align-self: flex-start" :rows="2" type="textarea" v-model="description"/>
      
    </el-form-item>
  </el-form>
  
</template>

<script lang="ts" setup>
import {ref, watch, computed, inject, unref, isProxy, toRaw} from "vue"
import { ElInput, ElForm, ElFormItem } from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenedKey, updatePropertyKey} from "@/config/app.keys";
import {BpmnUtil} from "../util"

const key = ref<string>()
const name = ref<string>()
const description = ref<string>()
const type = ref<string>()
const creator = ref<string>()

const innerWidth = "360px"
const labelWidth = "70px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`

const propertyPanelOpen = inject(propertyPanelOpenedKey)
const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
watch(bpmnSelectedElem, () => {
  console.info("common node watch bpmnSelectedElem", bpmnSelectedElem.value)

  const businessObject = bpmnSelectedElem.value?.businessObject as BusinessObject
  key.value = businessObject?.id
  name.value = businessObject?.name
  if (businessObject?.documentation && businessObject?.documentation.length > 0) {
    description.value = businessObject?.documentation[0].text
  } else {
    description.value = ""
  }
  type.value = businessObject?.$type
  const defaultTypes = ["bpmn:UserTask", "bpmn:SequenceFlow"]
  if (!defaultTypes.includes(type.value)) {
    propertyPanelOpen.value = 'base-setting'
  }

  if (type.value === "bpmn:StartEvent") {
    creator.value = businessObject.initiator
  }

}, {immediate: true})
// immediate的原因是 process和commonNode的切换是 V-IF 切换的时候 新的watch函数没法执行
// 也可切换V-show解决这个问题，但是v-show不能多根节点

function handleInputChange(from, val) {
  const bpmnUtil: BpmnUtil = new BpmnUtil(toRaw(bpmnModeler.value))
  const selectedElem = toRaw(bpmnSelectedElem.value)
  console.log("isProxy", isProxy(bpmnSelectedElem.value), selectedElem)
  const businessObject = bpmnSelectedElem.value?.businessObject! as BusinessObject
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
  } else if (from === "creator") {
    bpmnUtil.updateProperty(selectedElem, {
      "flowable:initiator": val
    })
  }
  console.log(from, val)
}

</script>

<style scoped>

</style>
