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

    <el-form-item prop="multiple" label="多选">
      <el-radio-group v-model="formData.multiple" @change="handleChangeMultiple">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="disabled" label="禁用">
      <el-radio-group v-model="vFormSelectElem.attrs.disabled">
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

    <el-form-item prop="collapseTags" label="多选文字展示">
      <template #label>
        <form-item-tooltip
          title="多选文字展示"
          content="多选时是否将选中值按文字的形式展示"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.collapseTags">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="collapseTagsTooltip" label="悬停展示标签">
      <template #label>
        <form-item-tooltip
          title="悬停展示标签"
          content="当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，<code>collapse-tags</code>属性必须设定为 true"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.collapseTagsTooltip">
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


    <el-form-item prop="autocomplete" label="自动补全">
      <template #label>
        <form-item-tooltip
          title="自动补全"
          content="Select 输入框的原生 autocomplete 属性"
        />
      </template>
      <el-input v-model="vFormSelectElem.attrs.autocomplete"></el-input>
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

    <el-form-item prop="allowCreate" label="是否允许创建">
      <template #label>
        <form-item-tooltip
          title="是否允许创建"
          content="是否允许用户创建新条目， 只有当 <code>filterable</code> 设置为 true 时才会生效"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.allowCreate">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="remote" label="是否远程加载">
      <template #label>
        <form-item-tooltip
          title="远程加载"
          content="其中的选项是否从服务器远程加载"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.remote">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="loading" label="远程加载状态">
      <template #label>
        <form-item-tooltip
          title="远程加载状态"
          content="Select 组件是否从远程加载数据"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.loading">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="loadingText" label="加载显示文本">
      <template #label>
        <form-item-tooltip
          title="加载显示文本"
          content="从服务器加载内容时显示的文本"
        />
      </template>
      <el-input v-model="vFormSelectElem.attrs.loadingText"></el-input>
    </el-form-item>

    <el-form-item prop="noMatchText" label="无匹配文本">
      <template #label>
        <form-item-tooltip
          title="无匹配文本"
          content="搜索条件无匹配时显示的文字，也可以使用 <code>empty</code> 插槽设置"
        />
      </template>
      <el-input v-model="vFormSelectElem.attrs.noMatchText"></el-input>
    </el-form-item>

    <el-form-item prop="noDataText" label="无数据文本">
      <template #label>
        <form-item-tooltip
          title="无数据文本"
          content="无选项时显示的文字，也可以使用 <code>empty</code> 插槽设置自定义内容"
        />
      </template>
      <el-input v-model="vFormSelectElem.attrs.noDataText"></el-input>
    </el-form-item>

    <el-form-item prop="popperClass" label="下拉框CSS类">
      <template #label>
        <form-item-tooltip
          title="下拉框CSS类"
          content="Select 下拉框的自定义类名"
        />
      </template>
      <el-input v-model="vFormSelectElem.attrs.popperClass"></el-input>
    </el-form-item>

    <el-form-item prop="reserveKeyword" label="保留关键词">
      <template #label>
        <form-item-tooltip
          title="保留关键词"
          content="当 <code>multiple</code> 和 <code>filter</code>被设置为 true 时，是否在选中一个选项后保留当前的搜索关键词"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.reserveKeyword">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="defaultFirstOption" label="回车匹配第一">
      <template #label>
        <form-item-tooltip
          title="回车匹配第一"
          content="是否在输入框按下回车时，选择第一个匹配项。 需配合 filterable 或 remote 使用"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.defaultFirstOption">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="teleported" label="插入到Body">
      <template #label>
        <form-item-tooltip
          title="插入到Body"
          content="是否将下拉列表插入至 body 元素"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.teleported">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="persistent" label="未激活删除">
      <template #label>
        <form-item-tooltip
          title="未激活删除"
          content="当下拉选择器未被激活并且persistent设置为false，选择器会被删除。"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.persistent">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="automaticDropdown" label="单击弹出菜单">
      <template #label>
        <form-item-tooltip
          title="单击弹出菜单"
          content="对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.automaticDropdown">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="clearIcon" label="清除图标">
      <el-input v-model="vFormSelectElem.attrs.clearIcon"></el-input>
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


    <el-form-item prop="suffixIcon" label="后缀图标">
      <el-input v-model="vFormSelectElem.attrs.suffixIcon"></el-input>
    </el-form-item>


    <el-form-item prop="tagType" label="标签类型">
      <el-select v-model="vFormSelectElem.attrs.tagType">
        <el-option label="success" value="success"></el-option>
        <el-option label="info" value="info"></el-option>
        <el-option label="warning" value="warning"></el-option>
        <el-option label="danger" value="danger"></el-option>
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElRadioGroup, ElRadioButton,
} from 'element-plus'
import { inject, ref } from "vue";
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