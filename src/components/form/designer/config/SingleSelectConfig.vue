<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >

    <el-form-item prop="expand" label="展开选项">
      <template #label>
        <form-item-tooltip
          title="展开选项"
          content="展开为选项列表"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.expand" @change="v => v === false ? (vFormSelectElem.attrs.buttonOption = false) : (vFormSelectElem.attrs.buttonOption = true)">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="buttonOption" label="按钮样式">
      <template #label>
        <form-item-tooltip
          title="按钮样式"
          content="是否使用按钮选项"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.buttonOption" :disabled="vFormSelectElem.attrs.expand === false">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="valueField" label="值字段">
      <el-input v-model="vFormSelectElem.attrs.valueField"></el-input>
    </el-form-item>
    <el-form-item prop="labelField" label="标签字段">
      <el-input v-model="vFormSelectElem.attrs.labelField"></el-input>
    </el-form-item>
    <el-form-item prop="disabledField" label="禁用字段">
      <el-input v-model="vFormSelectElem.attrs.disabledField"></el-input>
    </el-form-item>

    <el-form-item prop="size" label="大小">
      <el-radio-group v-model="vFormSelectElem.attrs.size">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="checkStrictly" label="父子不关联">
      <el-radio-group v-model="vFormSelectElem.attrs.checkStrictly">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="clearable" label="是否可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="placeholder" label="占位符">
      <el-input v-model="vFormSelectElem.attrs.placeholder"></el-input>
    </el-form-item>

    <el-form-item prop="filterable" label="是否可筛选">
      <template #label>
        <form-item-tooltip
          title="是否可筛选"
          content="Select 组件是否可筛选"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.filterable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="fitInputWidth" label="下拉宽度匹配">
      <template #label>
        <form-item-tooltip
          title="下拉宽度匹配"
          content="下拉框的宽度是否与输入框相同"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.fitInputWidth">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="defaultExpandAll" label="默认展开全部选项">
      <template #label>
        <form-item-tooltip
          title="默认展开选项"
          content="默认展开全部选项"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.defaultExpandAll">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="renderAfterExpand" label="懒渲染">
      <template #label>
        <form-item-tooltip
          title="懒渲染"
          content="由于 render-after-expand 属性开启时，所选择的标签名可能不会及时更新显示，您可以把该属性设置为 false 来显示正确的名称"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.renderAfterExpand">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="style" label="样式">
      <el-input v-model="vFormSelectElem.attrs.style"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton,
} from 'element-plus'
import { inject } from "vue";
import {vFormActiveElementKey} from "@/components/form/state.key";
import FormItemTooltip from "../../FormItemTooltip.vue"


const vFormSelectElem = inject(vFormActiveElementKey)


</script>

<style scoped>

</style>
