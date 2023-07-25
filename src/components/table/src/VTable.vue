<template>
  <div>
    <ag-grid-vue v-bind="props" />
  </div>
</template>
<script setup lang="ts" generic="T">
import { AgGridVue } from "ag-grid-vue3";
import { VTableProps } from "@/components/table/src/utils/types";

const props = defineProps<VTableProps<T>>()




</script>

<style scoped>

</style>