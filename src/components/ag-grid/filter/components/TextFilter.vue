<template>
  <el-input v-bind="props.params.componentProps" v-model="text" @change="handleValueChange" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElInput } from 'element-plus'
import { IHeaderGroupParams } from "ag-grid-community";

interface  HeaderFilterComponentParam extends IHeaderGroupParams {
  initValue: string
  onChange: (v: string) => void
  componentProps: Record<string, any>
}

interface Props {
  params: HeaderFilterComponentParam
}

const props = defineProps<Props>()

const text = ref(props.params.initValue)

function handleValueChange(v: string) {
  props.params.onChange(v)
}

</script>