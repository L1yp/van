<template>
  <template v-if="cMode === 'design'">
    <div>
      <el-tree-select
        v-if="props.expand === false"
        v-model="val"
        :loading="loading"
        style="width: 100%;"
        v-bind="$attrs"
        :node-key="props.valueField"
        disabled
        :props="{ label: props.labelField, children: 'children', disabled: props.disabledField }"
        :data="options"
      />
      <el-radio-group disabled v-model="val" v-bind="$attrs" v-if="props.expand === true">
        <template v-if="props.buttonOption === false">
          <el-radio
            v-for="option in flattenOptions"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio>
        </template>
        <template v-else>
          <el-radio-button
            v-for="option in flattenOptions"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>

  </template>
  <template v-else-if="cMode === 'edit'">
    <div>
      <el-tree-select
        v-if="props.expand === false"
        v-model="val"
        style="width: 100%;"
        :loading="loading"
        v-bind="$attrs"
        :node-key="props.valueField"
        :props="{ label: props.labelField, children: 'children', disabled: props.disabledField }"
        :data="options"
        
      />
      <el-radio-group v-model="val" v-bind="$attrs" v-if="props.expand === true">
        <template v-if="props.buttonOption === false">
          <el-radio
            v-for="option in flattenOptions"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio>
        </template>
        <template v-else>
          <el-radio-button
            v-for="option in flattenOptions"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElSelect, ElTreeSelect, ElOption, ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'
import { computed, inject, ref } from "vue";
import { formModeKey } from "@/components/form/state.key";
import { useModelingOptionApi } from '@/service/modeling/option';
import { findTreeItemById, flattenTree } from '@/utils/common';

interface Props {
  mode?: FormFieldMode
  value?: string
  defaultValue?: string
  expand?: boolean
  buttonOption?: boolean
  options: object[]
  optionTypeId?: string
  labelField?: string
  valueField?: string
  disabledField?: string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = withDefaults(defineProps<Props>(), {
  labelField: 'name',
  valueField: 'id',
  disabledField: 'disabled',
  expand: false,
  buttonOption: false,
})

const emits = defineEmits<Emits>()

const loading = ref(false)
const { modelingOptionValues, findModelingOptionValues } = useModelingOptionApi(loading)
let loadFlag = false
const options = computed(() => {
  const remoteOptions = modelingOptionValues.value
  if (props.options.length) {
    return props.options
  } else if (props.optionTypeId) {
    if (!loadFlag) {
      findModelingOptionValues({ typeId: props.optionTypeId })
      loadFlag = true
    }
    return remoteOptions
  } else {
    return []
  }
})
const flattenOptions = computed(() => flattenTree(options.value))


const val = computed({
  get: () => {
    if (props.value) {
      return props.value
    }
    if (props.defaultValue) {
      emits('update:value', props.defaultValue)
      return props.defaultValue
    }
    return ''
  },
  set: v => emits('update:value', v)
})

const displayValue = computed(() => {
  return findTreeItemById<any>(options.value, props.valueField, val.value)?.[props.labelField] || ''
})

const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})


</script>

<style scoped>

</style>