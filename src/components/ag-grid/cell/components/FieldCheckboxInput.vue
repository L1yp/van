<template>
  <el-checkbox v-model="props.params.data[props.params.column?.getColId()]" />
</template>
<script lang="ts" setup>
import { ElCheckbox } from 'element-plus'
import { ICellRendererParams } from 'ag-grid-community'

interface Props {
  params: ICellRendererParams
}

const props = defineProps<Props>()

</script>