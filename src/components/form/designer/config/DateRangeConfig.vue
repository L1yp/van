<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="dateRangeType" label="时间类型" required>
      <el-select v-model="vFormSelectElem.attrs.dateRangeType" @change="handleDateRangeTypeChange">
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
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="可编辑" prop="editable">
      <el-radio-group v-model="vFormSelectElem.attrs.editable">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="defaultValue" label="默认值">
      <el-date-picker
        :key="defKey"
        :type="vFormSelectElem?.attrs.dateRangeType"
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
import { vFormActiveElementKey } from "@/components/form/state.key";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";

const vFormSelectElem = inject(vFormActiveElementKey)


const defKey = ref<number>(0)

function handleDateRangeTypeChange(v: DateRangeType) {
  if (v === 'daterange') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY-MM-DD'
  }
  else if (v === 'datetimerange') {
    vFormSelectElem.value.attrs.format = 'YYYY-MM-DD HH:mm:ss'
    vFormSelectElem.value.attrs.valueFormat = 'YYYY-MM-DD HH:mm:ss'
  }


  vFormSelectElem.value.attrs.defaultValue = []

  defKey.value ++

}


</script>

<style scoped>

</style>
