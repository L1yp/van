<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="min" label="最小值">
      <el-input-number :controls="false" v-model="vFormSelectElem.attrs.min" style="width: 100%" />
    </el-form-item>
    <el-form-item prop="max" label="最大值">
      <el-input-number :controls="false" v-model="vFormSelectElem.attrs.max" style="width: 100%"/>
    </el-form-item>
    <el-form-item prop="default_value" label="默认值">
      <el-input-number :controls="false" v-model="vFormSelectElem.attrs.default_value" style="width: 100%" />
    </el-form-item>
    <el-form-item prop="precision" label="精度">
      <el-input-number :controls="false" v-model="vFormSelectElem.attrs.precision" style="width: 100%" />
    </el-form-item>
    <el-form-item prop="formatter" label="格式化函数">
      <el-input type="textarea" :rows="2" v-model="vFormSelectElem.attrs.formatter" />
    </el-form-item>
    <el-form-item prop="parser" label="解析函数">
      <el-input type="textarea" :rows="2" v-model="vFormSelectElem.attrs.parser" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElInputNumber,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>