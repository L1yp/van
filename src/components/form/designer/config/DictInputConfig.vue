<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    :key="vFormSelectElem.id"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >

    <el-form-item prop="scope" label="所属范围">
      <el-select :key="vFormSelectElem.id" v-model="vFormSelectElem.attrs.scope">
        <el-option
          v-for="scope in scopes"
          :label="scope"
          :value="scope"
          :key="scope"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="ident" label="字典标识">
      <el-select :key="vFormSelectElem.id" v-model="vFormSelectElem.attrs.ident">
        <el-option
          v-for="ident in idents"
          :label="ident"
          :value="ident"
          :key="ident"
        ></el-option>
      </el-select>
    </el-form-item>


    <el-form-item prop="valType" label="值类型">
      <el-radio-group v-model="vFormSelectElem.attrs.valType">
        <el-radio-button label="id"></el-radio-button>
        <el-radio-button label="value"></el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item v-show="isTree" prop="checkStrictly" label="多选">
      <template #label>
        <form-item-tooltip
          title="不级联选择"
          content="在显示复选框的情况下，选择父节点不会自动选择子节点"
        />
      </template>
      <el-radio-group v-model="vFormSelectElem.attrs.checkStrictly">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="multiple" label="多选">
      <el-radio-group v-model="vFormSelectElem.attrs.multiple">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="placeholder" label="占位符">
      <el-input :key="vFormSelectElem.id" v-model="vFormSelectElem.attrs.placeholder"></el-input>
    </el-form-item>


  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElInputNumber
} from 'element-plus'
import {computed, inject, watch} from "vue";
import {dictInfosKey, vFormActiveElementKey} from "@/config/app.keys";
import SVGIcon from "@/components/common/SVGIcon.vue";
import FormItemTooltip from '@/components/form/FormItemTooltip.vue'

const dictInfos = inject(dictInfosKey)

const scopes = computed<string[]>(() => Array.from(new Set(dictInfos.value.map(it => it.scope))))
const idents = computed<string[]>(() => {
  const idents = dictInfos.value
    .filter(it => it.scope === vFormSelectElem.value.attrs.scope)
    .map(it => it.ident)
  return Array.from(new Set(idents))
})

const isTree = computed<boolean>(() =>
  dictInfos.value.find(it => it.scope === vFormSelectElem.value.attrs.scope && it.ident === vFormSelectElem.value.attrs.ident)?.type === 2
)

const vFormSelectElem = inject(vFormActiveElementKey)
watch(vFormSelectElem, () => {
  console.log('DictInput Config', vFormSelectElem.value)
})

</script>

<style scoped>

</style>