<template>
  <el-form-item :prop="['scheme', 'multiple']" label="多选" required>
    <el-radio-group v-model="props.formData.scheme.multiple" :disabled="props.disabled">
      <el-radio-button :label="true">是</el-radio-button>
      <el-radio-button :label="false">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElRadioGroup, ElRadioButton } from "element-plus";

interface Props {
  disabled?: boolean
  formData: ModelingFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

</script>
<style scoped></style>