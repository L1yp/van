<template>
  <el-form-item :prop="['scheme', 'date_type']" label="时间类型">
    <el-select v-model="props.formData.scheme.date_type" @change="handleDateTypeChange">
      <el-option label="年份" value="year" />
      <el-option label="月份" value="month" />
      <el-option label="日期" value="date" />
      <el-option label="日期时间" value="datetime" />
      <el-option label="周" value="week" />
    </el-select>
  </el-form-item>

  <el-form-item :prop="['scheme', 'format']" label="显示格式">
    <template #label>
      <form-item-tooltip
        title="显示格式"
        content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
      />
    </template>
    <el-select v-model="props.formData.scheme.format" filterable allow-create default-first-option>
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'value_format']" label="值格式">
    <template #label>
      <form-item-tooltip
        title="值格式"
        content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
      />
    </template>
    <el-select v-model="props.formData.scheme.value_format" filterable allow-create default-first-option>
      <el-option label="YYYY" value="YYYY" />
      <el-option label="YYYY-MM" value="YYYY-MM" />
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
      <el-option label="YYYY-MM-DD d" value="YYYY-MM-DD d" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'default_value']" label="默认值">
    <el-date-picker
      :key="defKey"
      :type="props.formData.scheme.date_type"
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

function handleDateTypeChange(v: DateType) {
  if (v === 'year') {
    props.formData.scheme.format = 'YYYY'
    props.formData.scheme.value_format = 'YYYY'
  }
  else if (v === 'month') {
    props.formData.scheme.format = 'YYYY-MM'
    props.formData.scheme.value_format = 'YYYY-MM'
  }
  else if (v === 'date') {
    props.formData.scheme.format = 'YYYY-MM-DD'
    props.formData.scheme.value_format = 'YYYY-MM-DD'
  }
  else if (v === 'datetime') {
    props.formData.scheme.format = 'YYYY-MM-DD HH:mm:ss'
    props.formData.scheme.value_format = 'YYYY-MM-DD HH:mm:ss'
  }
  else if (v === 'week') {
    props.formData.scheme.format = 'd'
    props.formData.scheme.value_format = 'd'
  }

  //@ts-ignore
  props.formData.scheme.default_value = ''

  defKey.value ++

  
}

</script>
<style scoped></style>