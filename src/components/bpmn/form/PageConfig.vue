<template>
  <div class="field-item">
    <label>页面:&nbsp;</label>
    <el-select v-model="formData.process_model_page_id">
      <el-option
        v-for="item in pageList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
  <div class="field-item">
    <label>页面宽度:&nbsp;</label>
    <el-input v-model="formData.page_width" placeholder="请输入页面宽度，如: 851px"></el-input>
  </div>
  <div class="field-item">
    <label>标签宽度:&nbsp;</label>
    <el-input v-model="formData.label_width" placeholder="请输入标签宽度，如: 120px"></el-input>
  </div>
  <div class="field-item">
    <label>备注配置:&nbsp;</label>
    <el-select v-model="formData.comment">
      <el-option key="0" label="不需要" :value="0"></el-option>
      <el-option key="1" label="可选" :value="1"></el-option>
      <el-option key="2" label="必填" :value="2"></el-option>
    </el-select>
  </div>
  <el-button @click="handleBingPage" style="width: 100%">保存</el-button>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch, inject, toRaw, computed} from "vue"
import { ElRow, ElCol, ElInput, ElMessage, ElButton, ElSelect, ElOption } from "element-plus"
import {bpmnSelectedElemKey, processNodePageListKey} from "@/config/app.keys";
import {useRoute} from "vue-router";
import * as ProcessModelPageApi from "@/api/sys/process/page"
import * as ProcessModelApi from "@/api/sys/process";

const innerWidth = "360px"
const labelWidth = "70px"
const inputWidth = computed(() => `calc(${innerWidth} - ${labelWidth})`)

const route = useRoute()
const process_bpmn_id = Number(route.params.bpmnId)
const process_key = route.query.processKey as string
const bpmnSelectedElem = inject(bpmnSelectedElemKey);
const processNodePages = inject(processNodePageListKey);

const formData = ref<BindProcessModelNodePageParam>({
  process_key, process_bpmn_id,
  node_id: '',
  process_model_page_id: undefined,
  page_width: '851px',
  label_width: '120px',
  comment: 1
})

watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) return
  const bo = toRaw(selectedElem?.businessObject)
  formData.value.node_id = bo.id
  const pageInfo = processNodePages.value.find(it => it.node_id === bo.id)
  if (pageInfo) {
    console.log("pageInfo", pageInfo)
    formData.value.process_model_page_id = pageInfo.process_model_page_id
    formData.value.page_width = pageInfo.page_width
    formData.value.label_width = pageInfo.label_width
    formData.value.comment = pageInfo.comment
  } else {
    formData.value.process_model_page_id = undefined
    formData.value.page_width = '851px'
    formData.value.label_width = '120px'
    formData.value.comment = 1
  }

})

onMounted(async () => {
  await loadAllPage()
})

const pageList = ref<ProcessModelPageView[]>([])
async function loadAllPage() {
  try {
    pageList.value = await ProcessModelPageApi.listProcessPage(process_key)
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '加载页面失败')
  }
}

async function handleBingPage() {
  try {
    await ProcessModelPageApi.bindProcessNodePage(formData.value)
    processNodePages.value = await ProcessModelApi.listProcessPageByBpmnId(process_bpmn_id);
    ElMessage.success("绑定成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '绑定失败')
  }
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