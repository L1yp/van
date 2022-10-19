<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >


    <el-form-item prop="id" label="表单字段">
      <el-input type="text" v-model="vFormSelectElem.id"></el-input>
    </el-form-item>

        
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
    <el-form-item prop="multiple" label="多选">
      <el-radio-group v-model="formData.multiple" @change="handleChangeMultiple">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="valueKey" label="值属性">
      <el-input v-model="vFormSelectElem.attrs.valueKey"></el-input>
    </el-form-item>

    <el-form-item prop="size" label="大小">
      <el-radio-group v-model="vFormSelectElem.attrs.size">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-show="!vFormSelectElem.attrs.multiple" prop="clearable" label="是否可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="multipleLimit" label="多选条数限制">
      <template #label>
        <form-item-tooltip
          title="多选条数限制"
          content="<code>multiple</code> 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制"
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
          content="Tooltip 主题，内置了 <code>dark</code> / <code>light</code> 两种"
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
  ElTooltip
} from 'element-plus'
import {inject, nextTick, ref} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";
import SVGIcon from "@/components/common/SVGIcon.vue";
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