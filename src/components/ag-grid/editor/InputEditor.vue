<template>
  <div class="ag-cell-edit-wrapper">
    <el-input v-bind="params?.componentProps" v-model="text" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
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
  return text.value
}

// 开始编辑之前 是否需要取消编辑
/**
 * Gets called once before editing starts, to give editor a chance to cancel the editing before it even starts.
 */
function isCancelBeforeStart() {
  return false
}

/**
 * Gets called once when editing is finished (eg if Enter is pressed). If you return true, then the result of the edit will be ignored.
 */
function isCancelAfterEnd() {
  return false
}

onMounted(() => {
  text.value = props.params?.value
})

defineExpose({
  getValue,
  isCancelBeforeStart,
  isCancelAfterEnd,
})

</script>