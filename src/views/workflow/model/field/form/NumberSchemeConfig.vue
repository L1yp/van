<template>
  <el-form-item :prop="['scheme', 'min']" label="最小值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).min" :disabled="props.disabled" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'max']" label="最大值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).max" :disabled="props.disabled" style="width: 100%"/>
  </el-form-item>
  <el-form-item :prop="['scheme', 'defaultValue']" label="默认值">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).defaultValue" :disabled="props.disabled" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'precision']" label="精度">
    <el-input-number :controls="false" v-model="(props.formData.scheme as NumberInputFieldScheme).precision" :disabled="props.disabled" style="width: 100%" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'formatter']" label="格式化函数">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).formatter" :disabled="props.disabled" />
  </el-form-item>
  <el-form-item :prop="['scheme', 'parser']" label="解析函数">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).parser" :disabled="props.disabled" />
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElInput, ElInputNumber } from "element-plus";

interface Props {
  disabled?: boolean
  formData: WorkflowFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

</script>
<style scoped></style>