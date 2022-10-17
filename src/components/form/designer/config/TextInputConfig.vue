<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >

    <el-form-item prop="showWordLimit" label="展示字数统计">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.showWordLimit">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="placeholder" label="占位文本">
      <el-input v-model="vFormSelectElem.attrs.inputProps.placeholder"></el-input>
    </el-form-item>
    <el-form-item prop="clearable" label="是否可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="showPassword" label="切换密码图标">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.size">
        <el-radio-button :label="true">展示</el-radio-button>
        <el-radio-button :label="false">隐藏</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="size" label="大小">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.size">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="prefixIcon" label="前缀图标">
      <el-input type="text" v-model="vFormSelectElem.attrs.inputProps.prefixIcon"></el-input>
    </el-form-item>

    <el-form-item prop="suffixIcon" label="后缀图标">
      <el-input type="text" v-model="vFormSelectElem.attrs.inputProps.suffixIcon"></el-input>
    </el-form-item>

    <el-form-item prop="rows" label="行数">
      <el-input-number v-model="vFormSelectElem.attrs.inputProps.rows"></el-input-number>
    </el-form-item>

    <el-form-item prop="autoresize" label="高度自适应">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.autoresize">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="name" label="name(原生)">
      <el-input type="text" v-model="vFormSelectElem.attrs.inputProps.name"></el-input>
    </el-form-item>

    <el-form-item prop="readonly" label="是否只读(原生)">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.readonly">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="max" label="最大值(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.inputProps.max"></el-input-number>
    </el-form-item>

    <el-form-item prop="min" label="最小值(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.inputProps.min"></el-input-number>
    </el-form-item>

    <el-form-item prop="step" label="步数(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.inputProps.step"></el-input-number>
    </el-form-item>

    <el-form-item prop="resize" label="缩放">
      <el-select v-model="vFormSelectElem.attrs.inputProps.resize">
        <el-option label="无" value="none"></el-option>
        <el-option label="横向" value="horizontal"></el-option>
        <el-option label="纵向" value="vertical"></el-option>
        <el-option label="横向&纵向" value="both"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="autofocus" label="自动获取焦点">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.autofocus">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="validateEvent" label="输入触发校验">
      <el-radio-group v-model="vFormSelectElem.attrs.inputProps.validateEvent">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="inputStyle" label="输入框样式">
      <el-input type="textarea" v-model="vFormSelectElem.attrs.inputProps.inputStyle"></el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElInputNumber
} from 'element-plus'
import {inject} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";
import SVGIcon from "@/components/common/SVGIcon.vue";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>