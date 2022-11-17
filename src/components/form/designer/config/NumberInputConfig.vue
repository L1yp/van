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
    <el-form-item prop="defaultValue" label="默认值">
      <el-input-number :controls="false" v-model="vFormSelectElem.attrs.defaultValue" style="width: 100%" />
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
    <el-form-item prop="mode" label="模式">
      <el-checkbox-group v-model="mode" :min="0" :max="1">
        <el-checkbox-button label="design">设计</el-checkbox-button>
        <el-checkbox-button label="read">只读</el-checkbox-button>
        <el-checkbox-button label="edit">编辑</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElInputNumber, ElCheckboxGroup, ElCheckboxButton,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/components/form/state.key";

const vFormSelectElem = inject(vFormActiveElementKey)
const mode = computed({
  get: () => vFormSelectElem.value.attrs.mode ? [vFormSelectElem.value.attrs.mode] : [],
  set: v => {
    if (v?.length) {
      vFormSelectElem.value.attrs.mode = v[0]
    } else {
      vFormSelectElem.value.attrs.mode = undefined
    }
  }
})
</script>

<style scoped>

</style>
