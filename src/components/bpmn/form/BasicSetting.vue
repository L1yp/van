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
import {computed, inject, onUnmounted} from "vue";
import { bpmnModelerKey, bpmnSelectedElemKey } from "@/config/app.keys";
import { ElInput, ElForm, ElFormItem } from "element-plus"
import { BpmnUtil} from "./util"
import emitter, {ElementChanged} from "@/event/mitt";


const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const bpmnModeler = inject(bpmnModelerKey)

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

const elementName = computed({
  get() {
    if (!bpmnSelectedElem.value) {
      return ''
    }
    return bpmnSelectedElem.value.businessObject?.name || ''
  },
  set(v) {
    bpmnUtil.updateProperty(bpmnSelectedElem, {
      name: v
    })
  }
})

const elementDescription = computed({
  get() {
    if (!bpmnSelectedElem.value) {
      return ''
    }
    const bo = bpmnSelectedElem.value.businessObject
    const docs = bo.get("documentation")
    return docs?.[0]?.text || ''
  },
  set(v) {
    const bo = bpmnSelectedElem.value.businessObject
    const docs = bo.get("documentation")
    console.log("docs", docs)
    if (!docs || docs.length === 0) {
      const comment = bo.$model.create('bpmn:Documentation', { text: v });
      docs.push(comment)
    } else {
      docs[0].text = v
    }
    elementDescription?.effect?.scheduler()
  }
})

function refreshState(e: ElementChanged) {
  elementType?.effect?.scheduler()
  elementId?.effect?.scheduler()
  elementName?.effect?.scheduler()
  elementDescription?.effect?.scheduler()
}

emitter.on('elementChanged', refreshState)

onUnmounted(() => emitter.off('elementChanged', refreshState))
</script>

<style scoped>
* {
  font-size: 14px;
}

</style>