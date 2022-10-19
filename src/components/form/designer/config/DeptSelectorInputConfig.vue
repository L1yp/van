<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    :key="vFormSelectElem.id"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="id" label="表单字段">
      <el-input type="text" v-model="vFormSelectElem.attrs.id"></el-input>
    </el-form-item>
    
    <el-form-item prop="placeholder" label="占位符">
      <el-input :key="vFormSelectElem.id" v-model="vFormSelectElem.attrs.placeholder"></el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton, 
} from 'element-plus'
import {computed, inject, watch} from "vue";
import { vFormActiveElementKey } from "@/config/app.keys";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>