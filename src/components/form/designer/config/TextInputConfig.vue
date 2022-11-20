<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="defaultValue" label="默认值">
      <el-input v-model="vFormSelectElem.attrs.defaultValue"></el-input>
    </el-form-item>
    <el-form-item prop="minlength" label="最小长度">
      <el-input-number v-model="vFormSelectElem.attrs.minlength"></el-input-number>
    </el-form-item>
    <el-form-item prop="maxlength" label="最大长度">
      <el-input-number v-model="vFormSelectElem.attrs.maxlength"></el-input-number>
    </el-form-item>

    <el-form-item prop="showWordLimit" label="展示字数统计">
      <el-radio-group v-model="vFormSelectElem.attrs.showWordLimit">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="placeholder" label="占位文本">
      <el-input v-model="vFormSelectElem.attrs.placeholder"></el-input>
    </el-form-item>
    <el-form-item prop="clearable" label="是否可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="type" label="多行文本">
      <el-radio-group v-model="vFormSelectElem.attrs.type" @change="handleChangeTextType" >
        <el-radio-button label="textarea">是</el-radio-button>
        <el-radio-button label="text">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <template v-if="vFormSelectElem.attrs.type === 'textarea'">

      <el-form-item prop="rows" label="行数">
        <el-input-number v-model="vFormSelectElem.attrs.rows"></el-input-number>
      </el-form-item>

      <el-form-item prop="autoresize" label="高度自适应">
        <el-radio-group v-model="vFormSelectElem.attrs.autoresize">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="resize" label="缩放">
        <el-select v-model="vFormSelectElem.attrs.resize">
          <el-option label="无" value="none"></el-option>
          <el-option label="横向" value="horizontal"></el-option>
          <el-option label="纵向" value="vertical"></el-option>
          <el-option label="横向&纵向" value="both"></el-option>
        </el-select>
      </el-form-item>

    </template>

    <el-form-item prop="autofocus" label="自动获取焦点">
      <el-radio-group v-model="vFormSelectElem.attrs.autofocus">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="validateEvent" label="输入触发校验">
      <el-radio-group v-model="vFormSelectElem.attrs.validateEvent">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="inputStyle" label="输入框样式">
      <el-input type="textarea" v-model="vFormSelectElem.attrs.inputStyle"></el-input>
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
  ElForm, ElFormItem, ElInput, ElCheckboxGroup, ElRadioGroup, ElRadioButton, ElCheckboxButton, ElSelect, ElOption, ElInputNumber,
} from 'element-plus'
import { computed, inject } from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";

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

function handleChangeTextType(textarea: boolean) {
  if (textarea) {
    vFormSelectElem.value.attrs.rows = 2
    vFormSelectElem.value.attrs.autoresize = true
    vFormSelectElem.value.attrs.resize = 'both'
  } else {
    vFormSelectElem.value.attrs.rows = undefined
    vFormSelectElem.value.attrs.autoresize = undefined
    vFormSelectElem.value.attrs.resize = undefined
  }
}

</script>

<style scoped>

</style>
