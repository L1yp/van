<template>
  <el-form-item :prop="['scheme', 'from']" label="数据来源">
    <el-radio-group v-model="(props.formData.scheme as OptionFieldScheme).from">
      <el-radio-button label="DEFAULT">默认</el-radio-button>
      <el-radio-button label="CLASS">Java类</el-radio-button>
      <el-radio-button label="TABLE">指定表</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <template v-if="(props.formData.scheme as OptionFieldScheme).from === 'DEFAULT'">
    <el-form-item :prop="['scheme', 'option_type_id']" label="数据源">
      <el-select v-model="(props.formData.scheme as DefaultOptionFieldScheme).option_type_id">

      </el-select>
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
import { ElFormItem, ElInput, ElInputNumber, ElRadioGroup, ElRadioButton, ElSelect, ElOption } from "element-plus";

interface Props {
  formData: WorkflowFieldAddParam
}

const props = defineProps<Props>()

</script>
<style scoped></style>