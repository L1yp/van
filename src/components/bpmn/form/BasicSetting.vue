<template>
  <el-form label-width="80px" label-position="right">
    <el-form-item label="节点类型">
      <el-input disabled v-model="elementType" />
    </el-form-item>
    <el-form-item label="节点标识">
      <el-input disabled v-model="elementId" />
    </el-form-item>
    <el-form-item label="节点名称">
      <el-input v-model="elementName" />
    </el-form-item>
    <el-form-item label="节点描述">
      <el-input style="align-self: flex-start" :rows="2" type="textarea" v-model="elementDescription"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus"
import { BpmnUtil} from "./util"
import { useBpmnModeler, useBpmnSelectedElem } from "@/config/app.hooks";


const bpmnSelectedElem = useBpmnSelectedElem()
const bpmnModeler = useBpmnModeler()

const bpmnUtil = new BpmnUtil(bpmnModeler)

const elementType = computed(() => {
  if (!bpmnSelectedElem.value) {
    return ''
  }
  return bpmnSelectedElem.value?.type || ''
})


const elementId = computed(() => {
  if (!bpmnSelectedElem.value) {
    return ''
  }
  return bpmnSelectedElem.value?.id || ''
})

const elementNameKey = ref(1)
const elementName = computed({
  get() {
    const depKey = elementNameKey.value
    if (!bpmnSelectedElem.value) {
      return ''
    }
    return bpmnSelectedElem.value.businessObject?.name || ''
  },
  set(v) {
    elementNameKey.value++
    bpmnUtil.updateProperty(bpmnSelectedElem, {
      name: v
    })
  }
})

const elementDescriptionKey = ref(1)
const elementDescription = computed({
  get() {
    const depKey = elementDescriptionKey.value
    if (!bpmnSelectedElem.value) {
      return ''
    }
    const bo = bpmnSelectedElem.value.businessObject
    const docs = bo.get("documentation")
    return docs?.[0]?.text || ''
  },
  set(v) {
    elementDescriptionKey.value++
    const bo = bpmnSelectedElem.value.businessObject
    const docs = bo.get("documentation")
    console.log("docs", docs)
    if (!docs || docs.length === 0) {
      const comment = bo.$model.create('bpmn:Documentation', { text: v });
      docs.push(comment)
    } else {
      docs[0].text = v
    }
    elementDescription?.effect?.scheduler?.()
  }
})
</script>

<style scoped>
* {
  font-size: 14px;
}

</style>