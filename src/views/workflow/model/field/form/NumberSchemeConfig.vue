<template>
  <el-form-item :prop="['scheme', 'min']" label="最小值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).min" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'max']" label="最大值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).max"  style="width: 100%"/>
  </el-form-item>
  <el-form-item :prop="['scheme', 'default_value']" label="默认值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).default_value" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'precision']" label="精度">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).precision" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'formatter']" label="格式化函数">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).formatter" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'parser']" label="解析函数">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).parser" />
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