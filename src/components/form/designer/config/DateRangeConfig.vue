<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="date_range_type" label="时间类型" required>
      <el-select v-model="vFormSelectElem.attrs.date_range_type" @change="handleDateRangeTypeChange">
        <el-option label="日期范围" value="daterange" />
        <el-option label="日期时间范围" value="datetimerange" />
      </el-select>
    </el-form-item>

    <el-form-item prop="format" label="显示格式" required>
      <template #label>
        <form-item-tooltip
          title="显示格式"
          content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
        />
      </template>
      <el-select v-model="vFormSelectElem.attrs.format" filterable allow-create default-first-option>
        <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
        <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
      </el-select>
    </el-form-item>
    <el-form-item prop="value_format" label="值格式" required>
      <template #label>
        <form-item-tooltip
          title="值格式"
          content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
        />
      </template>
      <el-select v-model="vFormSelectElem.attrs.value_format" filterable allow-create default-first-option>
        <el-option label="YYYY" value="YYYY" />
        <el-option label="YYYY-MM" value="YYYY-MM" />
        <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
        <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
        <el-option label="YYYY-MM-DD d" value="YYYY-MM-DD d" />
      </el-select>
    </el-form-item>
    <el-form-item prop="default_value" label="默认值">
      <el-date-picker
        :key="defKey"
        :type="vFormSelectElem?.attrs.date_range_type"
        v-model="vFormSelectElem.attrs.default_value"
        :format="vFormSelectElem?.attrs.format"
        :value-format="vFormSelectElem?.attrs.value_format"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElDatePicker, ElSelect, ElOption,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";

const vFormSelectElem = inject(vFormActiveElementKey)


const defKey = ref<number>(0)

function handleDateRangeTypeChange(v: DateRangeType) {
  if (v === 'daterange') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD'
    vFormSelectElem.value.attrs.value_format = 'YYYY-MM-DD'
  }
  else if (v === 'datetimerange') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD HH:mm:ss'
    vFormSelectElem.value.attrs.value_format = 'YYYY-MM-DD HH:mm:ss'
  }


  //@ts-ignore
  vFormSelectElem.value.attrs.default_value = ['', '']

  defKey.value ++
  
}


</script>

<style scoped>

</style>