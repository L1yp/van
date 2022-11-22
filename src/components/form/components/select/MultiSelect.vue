<template>
  <template v-if="cMode === 'design'">
    <div v-loading="loading">
      <el-tree-select
        v-if="props.expand === false"
        v-model="val"
        multiple collapse-tags collapse-tags-tooltip
        :loading="loading"
        style="width: 100%;"
        v-bind="$attrs"
        :node-key="props.valueField"
        disabled
        :props="{ label: props.labelField, children: 'children', disabled: props.disabledField }"
        :data="options"
      />
      <el-checkbox-group disabled v-if="props.expand === true" v-model="val" v-bind="$attrs">
        <template v-if="props.buttonOption === true">
          <el-checkbox-button
            v-for="option in flattenOptions"
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox-button>
        </template>
        <template v-else>
          <el-checkbox
            v-for="option in flattenOptions"
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox>
        </template>

      </el-checkbox-group>
    </div>

  </template>
  <template v-else-if="cMode === 'edit'">
    <div v-loading="loading">
      <el-tree-select
        v-if="props.expand === false"
        v-model="val"
        multiple collapse-tags collapse-tags-tooltip
        :loading="loading"
        style="width: 100%;"
        v-bind="$attrs"
        :node-key="props.valueField"
        :props="{ label: props.labelField, children: 'children', disabled: props.disabledField }"
        :data="options"
      />

      <el-checkbox-group v-if="props.expand === true" v-model="val" v-bind="$attrs">
        <template v-if="props.buttonOption === true">
          <el-checkbox-button
            v-for="option in flattenOptions"
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox-button>
        </template>
        <template v-else>
          <el-checkbox
            v-for="option in flattenOptions"
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox>
        </template>
      </el-checkbox-group>
    </div>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-loading="loading" v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElTreeSelect, ElCheckboxGroup, ElCheckbox, ElCheckboxButton } from 'element-plus'
import { computed, inject, nextTick, ref } from "vue";
import { formModeKey } from "@/components/form/state.key";
import { useModelingOptionApi } from '@/service/modeling/option';
import { flattenTree } from '@/utils/common';

interface Props {
  mode?: FormFieldMode
  value?: string
  defaultValue?: string[]
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
      const result = props.value?.split(',') || []
      // console.log('multi select modelValue get', result);
      return result
    }
    if (props.defaultValue) {
      nextTick(() => emits('update:value', props.defaultValue.join(',')))
      return props.defaultValue
    }
    return []
  },
  set: v => {
    const value = v?.join(',') || ''
    // console.log('multi select modelValue set', value);

    emits('update:value', value)
  }
})

const displayValue = computed(() => {
  let values = val.value
  const optionsMap = new Map(flattenOptions.value.map(it => [it[props.valueField], it]))
  const display = values.map(it => optionsMap.get(it)?.[props.labelField] || it)?.join(', ')
  return display
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