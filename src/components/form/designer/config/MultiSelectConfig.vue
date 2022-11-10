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
          title="选项样式"
          content="是否使用按钮选项"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.buttonOption" :disabled="vFormSelectElem.attrs.expand === false">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="clearable" label="可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="checkStrictly" label="父子不关联">
      <el-radio-group v-model="vFormSelectElem.attrs.checkStrictly">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="multipleLimit" label="多选条数限制">
      <template #label>
        <form-item-tooltip
          title="多选条数限制"
          content="<code style='background-color: transparent'>multiple</code> 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制"
        />
      </template>
      <el-input-number v-model="vFormSelectElem.attrs.multipleLimit"></el-input-number>
    </el-form-item>


    <el-form-item prop="name" label="名称">
      <el-input v-model="vFormSelectElem.attrs.name"></el-input>
    </el-form-item>

    <el-form-item prop="effect" label="Tooltip主题">
      <template #label>
        <form-item-tooltip
          title="Tooltip主题"
          content="Tooltip 主题，内置了 dark / light 两种"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.effect">
        <el-radio-button label="dark">亮</el-radio-button>
        <el-radio-button label="light">暗</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="placeholder" label="占位符">
      <el-input v-model="vFormSelectElem.attrs.placeholder"></el-input>
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

    <el-form-item prop="tagType" label="标签类型">
      <el-select v-model="vFormSelectElem.attrs.tagType">
        <el-option label="success" value="success"></el-option>
        <el-option label="info" value="info"></el-option>
        <el-option label="warning" value="warning"></el-option>
        <el-option label="danger" value="danger"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="style" label="样式">
      <el-input v-model="vFormSelectElem.attrs.style"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElRadioGroup, ElRadioButton,
} from 'element-plus'
import { inject, ref} from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import FormItemTooltip from "../../FormItemTooltip.vue"
import emitter from "@/event/mitt";

const vFormSelectElem = inject(vFormActiveElementKey)

interface FormData {
  multiple: boolean
}

const formData = ref<FormData>({
  multiple: vFormSelectElem.value?.attrs?.multiple
})

function handleChangeMultiple(val: boolean) {
  console.log('handleChangeMultiple', val, vFormSelectElem.value.key)
  emitter.emit('selectMultipleChanged', {
    multiple: val,
    prop: vFormSelectElem.value.id
  })

  vFormSelectElem.value.key++
}

</script>

<style scoped>

</style>
