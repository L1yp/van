<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    :key="vFormSelectElem.id"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="placeholder" label="占位符">
      <el-input :key="vFormSelectElem.id" v-model="vFormSelectElem.attrs.placeholder"></el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput
} from 'element-plus'
import { inject } from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>
