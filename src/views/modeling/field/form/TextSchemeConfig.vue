<template>
  <el-form-item :prop="['scheme', 'defaultValue']" label="默认值">
    <el-input type="textarea" :rows="2" v-model="(props.formData.scheme as NumberInputFieldScheme).defaultValue" :disabled="props.disabled" />
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElInput } from "element-plus";

interface Props {
  disabled?: boolean
  formData: ModelingFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

</script>
<style scoped></style>