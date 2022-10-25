<template>
  <el-form
    :model="formScheme"
    label-position="right"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="labelPosition" label="标签位置" required>
      <el-radio-group v-model="formScheme.labelPosition">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
        <el-radio-button label="top">上对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="labelWidth" label="标签宽度" required>
      <el-input v-model="formScheme.labelWidth"></el-input>
    </el-form-item>

    <el-form-item prop="size" label="尺寸" required>
      <el-radio-group v-model="formScheme.size">
        <el-radio-button label="small">偏小</el-radio-button>
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="large">偏大</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="style" label="样式">
      <el-input v-model="formScheme.style"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElInput,
} from 'element-plus'
import { inject } from "vue";
import { vFormSchemeKey } from '../../state.key';

const formScheme = inject(vFormSchemeKey)

</script>

<style scoped>

</style>