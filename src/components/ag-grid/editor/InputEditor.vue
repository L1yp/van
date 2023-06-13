<template>
  <div class="ag-cell-edit-wrapper">
    <el-input v-bind="params?.componentProps" v-model="text" />
  </div>
</template>

<script lang="ts" setup>
import { defineOptions, onMounted, ref } from 'vue'
import { ElInput } from "element-plus";
import { CellEditorParams } from "@/components/ag-grid/editor/index";

interface Props {
  params: CellEditorParams
}

const props = defineProps<Props>()

const text = ref('')
// 开始编辑之前 是否需要取消编辑
/**
 * Gets called once before editing starts, to give editor a chance to cancel the editing before it even starts.
 */
function getValue() {
  console.log('input editor getValue', text.value)
  return text.value
}

// 开始编辑之前 是否需要取消编辑
/**
 * Gets called once before editing starts, to give editor a chance to cancel the editing before it even starts.
 */
function isCancelBeforeStart() {
  console.log('input editor isCancelBeforeStart')
  return false
}

/**
 * Gets called once when editing is finished (eg if Enter is pressed). If you return true, then the result of the edit will be ignored.
 */
function isCancelAfterEnd() {
  console.log('input editor isCancelAfterEnd')
  return false
}

defineExpose({
  getValue,
  isCancelBeforeStart,
  isCancelAfterEnd,
})

onMounted(() => {
  text.value = props.params?.value
})
</script>