<template>
  <el-scrollbar always>
    <VFormRender v-if="props.formData && props.scheme" v-bind="props" />
  </el-scrollbar>
  
</template>
<script lang="ts" setup>
import VFormRender from '@/components/form/designer/VFormRender.vue';
import { ElScrollbar } from "element-plus";

interface Props {
  scheme: VFormScheme | null
  formData: object | null
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>