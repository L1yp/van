<template>
  <el-scrollbar always :native="deviceType === 'h5'">
    <VFormRender v-if="props.formData && props.scheme" v-bind="props" />
  </el-scrollbar>

</template>
<script lang="ts" setup>
import VFormRender from '@/components/form/designer/VFormRender.vue';
import { ElScrollbar } from "element-plus";
import { getDeviceType } from "@/utils/common";

interface Props {
  scheme: VFormScheme | null
  formData: object | null
}

const props = defineProps<Props>()

const deviceType = getDeviceType()

</script>

<style scoped>

</style>