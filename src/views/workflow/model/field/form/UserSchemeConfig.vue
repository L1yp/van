<template>
  <el-form-item :prop="['scheme', 'multiple']" label="多选" required>
    <el-radio-group v-model="(props.formData.scheme as UserFieldScheme).multiple">
      <el-radio-button :label="true">是</el-radio-button>
      <el-radio-button :label="false">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item :prop="['scheme', 'from']" label="用户范围" required>
    <el-radio-group v-model="(props.formData.scheme as UserFieldScheme).from">
      <el-radio-button label="ALL">默认</el-radio-button>
      <el-radio-button label="CLASS">Java类</el-radio-button>
      <el-radio-button label="FIXED">固定</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <template v-if="(props.formData.scheme as UserFieldScheme).from === 'CLASS'">
    <el-form-item :prop="['scheme', 'class_name']" label="类名" required>
      <el-input v-model="(props.formData.scheme as ClassUserFieldScheme).class_name" style="width: 100%" />
    </el-form-item>
  </template>
  <template v-if="(props.formData.scheme as UserFieldScheme).from === 'FIXED'">
    <el-form-item :prop="['scheme', 'user_ids']" label="固定列表" required>
      <user-selector-input multiple v-model="(props.formData.scheme as FixedUserFieldScheme).user_ids" style="width: 100%" />
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
import { ElFormItem, ElRadioGroup, ElRadioButton, ElInput } from "element-plus";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";


interface Props {
  formData: WorkflowFieldAddParam
}

const props = defineProps<Props>()

</script>
<style scoped></style>