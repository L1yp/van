<template>
  <el-form-item :prop="['scheme', 'date_range_type']" label="时间类型" required>
    <el-select v-model="props.formData.scheme.date_range_type" @change="handleDateRangeTypeChange" :disabled="props.disabled">
      <el-option label="日期范围" value="daterange" />
      <el-option label="日期时间范围" value="datetimerange" />
    </el-select>
  </el-form-item>

  <el-form-item :prop="['scheme', 'format']" label="显示格式" required>
    <template #label>
      <form-item-tooltip
        title="显示格式"
        content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
      />
    </template>
    <el-select v-model="props.formData.scheme.format" filterable allow-create default-first-option :disabled="props.disabled">
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'value_format']" label="值格式" required>
    <template #label>
      <form-item-tooltip
        title="值格式"
        content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
      />
    </template>
    <el-select v-model="props.formData.scheme.value_format" filterable allow-create default-first-option :disabled="props.disabled">
      <el-option label="YYYY" value="YYYY" />
      <el-option label="YYYY-MM" value="YYYY-MM" />
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
      <el-option label="YYYY-MM-DD d" value="YYYY-MM-DD d" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'default_value']" label="默认值">
    <el-date-picker
      :disabled="props.disabled"
      :key="defKey"
      :type="props.formData.scheme.date_range_type"
      v-model="props.formData.scheme.default_value"
      :format="props.formData.scheme.format"
      :value-format="props.formData.scheme.value_format"
    />
  </el-form-item>
</template>
<script lang="ts" setup>
import { ElFormItem, ElDatePicker, ElSelect, ElOption } from "element-plus";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";
import { ref } from "vue";

interface Props {
  disabled?: boolean
  formData: WorkflowFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const defKey = ref<number>(0)

function handleDateRangeTypeChange(v: DateRangeType) {
  if (v === 'daterange') {
    props.formData.scheme.format = 'YYYY-MM-DD'
    props.formData.scheme.value_format = 'YYYY-MM-DD'
  }
  else if (v === 'datetimerange') {
    props.formData.scheme.format = 'YYYY-MM-DD HH:mm:ss'
    props.formData.scheme.value_format = 'YYYY-MM-DD HH:mm:ss'
  }


  //@ts-ignore
  props.formData.scheme.default_value = ['', '']

  defKey.value ++
  
}

</script>
<style scoped></style>