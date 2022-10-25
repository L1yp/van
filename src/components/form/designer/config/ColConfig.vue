<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >

    <el-form-item prop="span" label="栅格列数">
      <el-slider :min="0" :max="24" :marks="{ 0: '0', 12: '12' }" v-model="vFormSelectElem.attrs.span" />
    </el-form-item>
<!-- 
    <el-form-item prop="offset" label="左侧间隔格数">
      <el-input-number v-model="vFormSelectElem.attrs.offset"></el-input-number>
    </el-form-item>

    <el-form-item prop="push" label="栅格右移格数">
      <el-input-number v-model="vFormSelectElem.attrs.push"></el-input-number>
    </el-form-item>

    <el-form-item prop="pull" label="栅格左移格数">
      <el-input-number v-model="vFormSelectElem.attrs.pull"></el-input-number>
    </el-form-item>

    <el-form-item prop="tag" label="元素标签">
      <el-input type="text" v-model="vFormSelectElem.attrs.tag"></el-input>
    </el-form-item> -->

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElSlider
} from 'element-plus'
import { inject } from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>