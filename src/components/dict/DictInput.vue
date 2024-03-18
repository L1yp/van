<template>
  <template v-if="dictItem.component === 'button-group'">
    <template v-if="props.multiple">
      <ElCheckboxGroup v-model="val">
        <el-checkbox-button :label="option.value" v-for="option in dictItem.options" :key="option.value">{{ option.label }}</el-checkbox-button>
      </ElCheckboxGroup>
    </template>
    <template v-else>
      <el-radio-group v-model="val">
        <el-radio-button :value="option.value" v-for="option in dictItem.options" :key="option.value">{{ option.label }}</el-radio-button>
      </el-radio-group>
    </template>
  </template>
  <template v-else-if="dictItem.component === 'select'">
    <el-select v-model="val" :multiple="props.multiple">
      <el-option v-for="option in dictItem.options" :key="option.value" :label="option.label" :value="option.value"/>
    </el-select>
  </template>
  <template v-else-if="dictItem.component === 'tree-select'">
    <el-tree-select
      v-model="val"
      :data="dictItem.options"
      node-key="value"
    />
  </template>
</template>

<script lang="ts" setup>
import { ElRadioGroup, ElRadioButton, ElCheckboxGroup, ElCheckboxButton, ElSelect, ElOption, ElTreeSelect } from 'element-plus'
import { computed } from 'vue';
import DictConfig from './dict'

type ValueType = boolean | boolean[] | string | string[] | number | number[]

interface Props {
  modelValue: ValueType
  multiple?: boolean
  ident: string
}

interface Emits {
  (e: 'update:modelValue', v: ValueType): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
})

const emits = defineEmits<Emits>()

const dictItem = computed(() => DictConfig[props.ident])

const val = computed<ValueType>({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v)
})



</script>

<style scoped>

</style>