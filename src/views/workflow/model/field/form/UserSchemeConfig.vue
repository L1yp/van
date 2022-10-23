<template>
  <el-form-item :prop="['scheme', 'multiple']" label="多选" required>
    <el-radio-group v-model="props.formData.scheme.multiple" :disabled="props.disabled">
      <el-radio-button :label="true">是</el-radio-button>
      <el-radio-button :label="false">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item :prop="['scheme', 'user_content', 'from']" label="用户范围" required>
    <el-radio-group v-model="props.formData.scheme.user_content.from" :disabled="props.disabled">
      <el-radio-button label="ALL">默认</el-radio-button>
      <el-radio-button label="CLASS">Java类</el-radio-button>
      <el-radio-button label="FIXED">固定</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <template v-if="props.formData.scheme.user_content.from === 'CLASS'">
    <el-form-item :prop="['scheme', 'user_content', 'class_name']" label="类名" required>
      <el-input v-model="props.formData.scheme.user_content.class_name" :disabled="props.disabled" style="width: 100%" />
    </el-form-item>
  </template>
  <template v-if="props.formData.scheme.user_content.from === 'FIXED'">
    <el-form-item :prop="['scheme', 'user_content', 'user_ids']" label="固定列表" required>
      <user-selector-input multiple v-model="props.formData.scheme.user_content.user_ids" :disabled="props.disabled" style="width: 100%" />
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
import { ElFormItem, ElRadioGroup, ElRadioButton, ElInput } from "element-plus";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";


interface Props {
  disabled?: boolean
  formData: WorkflowFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

</script>
<style scoped></style>