<template>
  <el-form-item :prop="['scheme', 'default_value']" label="默认值">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).default_value" />
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElInput, ElInputNumber } from "element-plus";

interface Props {
  formData: WorkflowFieldAddParam
}

const props = defineProps<Props>()

</script>
<style scoped></style>