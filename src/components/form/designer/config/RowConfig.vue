<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >

    <el-form-item prop="gutter" label="栅格间隔">
      <el-input-number :min="0" v-model="vFormSelectElem.attrs.gutter"></el-input-number>
    </el-form-item>

    <el-form-item prop="justify" label="水平排列(flex)">
      <el-select v-model="vFormSelectElem.attrs.justify">
        <el-option label="start" value="start"></el-option>
        <el-option label="end" value="end"></el-option>
        <el-option label="center" value="center"></el-option>
        <el-option label="space-around" value="space-around"></el-option>
        <el-option label="space-between" value="space-between"></el-option>
        <el-option label="space-evenly" value="space-evenly"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="align" label="垂直排列(flex)">
      <el-select v-model="vFormSelectElem.attrs.align">
        <el-option label="top" value="top"></el-option>
        <el-option label="middle" value="middle"></el-option>
        <el-option label="end" value="end"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="tag" label="元素标签">
      <el-input type="text" v-model="vFormSelectElem.attrs.tag"></el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber
} from 'element-plus'
import {inject} from "vue";
import {vFormActiveElementKey} from "@/components/form/state.key";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>