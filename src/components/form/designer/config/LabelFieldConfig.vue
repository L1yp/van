<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="value" label="标签值">
      <el-input v-model="vFormSelectElem.attrs.value" />
    </el-form-item>
    <el-form-item prop="fontSize" label="文字大小">
      <el-input-number v-model="vFormSelectElem.attrs.fontSize" />
    </el-form-item>
    <el-form-item prop="color" label="颜色">
      <el-color-picker v-model="vFormSelectElem.attrs.color" show-alpha :predefine="predefineColors" />
    </el-form-item>
    <el-form-item prop="bgColor" label="背景色">
      <el-color-picker v-model="vFormSelectElem.attrs.bgColor" show-alpha :predefine="predefineColors" />
    </el-form-item>
    <el-form-item prop="style" label="样式">
      <el-input v-model="vFormSelectElem.attrs.style" />
    </el-form-item>

    <div class="preview">
      <label-field v-bind="vFormSelectElem.attrs" />
    </div>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElColorPicker, ElInputNumber,
} from 'element-plus'
import { inject } from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import LabelField from "@/components/form/components/display/LabelField.vue";

const vFormSelectElem = inject(vFormActiveElementKey)!

const predefineColors = ([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

</script>

<style scoped>

</style>