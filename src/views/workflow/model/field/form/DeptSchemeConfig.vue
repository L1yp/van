<template>
  <el-form-item :prop="['scheme', 'multiple']" label="多选">
    <el-radio-group v-model="(props.formData.scheme as DeptFieldScheme).multiple">
      <el-radio-button :label="true">是</el-radio-button>
      <el-radio-button :label="false">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElRadioGroup, ElRadioButton } from "element-plus";

interface Props {
  formData: WorkflowFieldAddParam
}

const props = defineProps<Props>()

</script>
<style scoped></style>