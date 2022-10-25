<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="dateType" label="时间类型" required>
      <el-select v-model="vFormSelectElem.attrs.dateType" @change="handleDateTypeChange">
        <el-option label="年份" value="year" />
        <el-option label="月份" value="month" />
        <el-option label="日期" value="date" />
        <el-option label="日期时间" value="datetime" />
        <el-option label="周" value="week" />
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
    <el-form-item prop="valueFormat" label="值格式" required>
      <template #label>
        <form-item-tooltip
          title="值格式"
          content="格式说明：https://dayjs.gitee.io/docs/zh-CN/display/format#list-of-all-available-formats"
        />
      </template>
      <el-select v-model="vFormSelectElem.attrs.valueFormat" filterable allow-create default-first-option>
        <el-option label="YYYY" value="YYYY" />
        <el-option label="YYYY-MM" value="YYYY-MM" />
        <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
        <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
        <el-option label="YYYY-MM-DD d" value="YYYY-MM-DD d" />
      </el-select>
    </el-form-item>
    <el-form-item label="可清空" prop="clearable">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="可编辑" prop="editable">
      <el-radio-group v-model="vFormSelectElem.attrs.editable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="defaultValue" label="默认值">
      <el-date-picker
        :key="defKey"
        :type="vFormSelectElem?.attrs.dateType"
        v-model="vFormSelectElem.attrs.defaultValue"
        :format="vFormSelectElem?.attrs.format"
        :value-format="vFormSelectElem?.attrs.valueFormat"
      />
    </el-form-item>
    <el-form-item prop="style" label="样式">
      <el-input v-model="vFormSelectElem.attrs.style"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElInput, ElDatePicker,
} from 'element-plus'
import { inject, ref } from "vue";
import {vFormActiveElementKey} from "@/components/form/state.key";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";


const vFormSelectElem = inject(vFormActiveElementKey)


const defKey = ref<number>(0)

function handleDateTypeChange(v: DateType) {
  if (v === 'year') {
    vFormSelectElem.value.attrs.format = 'YYYY'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY'
  }
  else if (v === 'month') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY-MM'
  }
  else if (v === 'date') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY-MM-DD'
  }
  else if (v === 'datetime') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD HH:mm:ss'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY-MM-DD HH:mm:ss'
  }
  else if (v === 'week') {
    vFormSelectElem.value.attrs.format = 'd'
    vFormSelectElem.value.attrs.valueFormat = 'd'
  }

  vFormSelectElem.value.attrs.defaultValue = ''


  defKey.value ++

  
}

</script>

<style scoped>

</style>