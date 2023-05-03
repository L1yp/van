<template>
  <el-input-number v-model="props.params.data[props.params.column?.getColId()]" :controls="false" style="width: 100%" />
</template>
<script lang="ts" setup>
import { ElInputNumber } from 'element-plus'
import { ICellRendererParams } from 'ag-grid-community'

interface Props {
  params: ICellRendererParams
}

const props = defineProps<Props>()

</script>