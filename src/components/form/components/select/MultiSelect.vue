<template>
  <template v-if="cMode === 'design'">
    <el-select 
      v-model="val" 
      multiple 
      disabled 
      :value-key="props.valueField" 
      v-bind="$props"
    >
      <el-option
        v-for="option in props.options"
        :key="option[props.valueField]"
        :label="option[props.labelField]"
        :value="option[props.valueField]"
        :disabled="option[props.disabledField]"
      >
      </el-option>
    </el-select>
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-select 
      v-model="val" 
      multiple
      collapse-tags
      collapse-tags-tooltip
      :value-key="props.valueField" 
      v-bind="$props"
    >
      <el-option
        v-for="option in props.options"
        :key="option[props.valueField]"
        :label="option[props.labelField]"
        :value="option[props.valueField]"
        :disabled="option[props.disabledField]"
      >
      </el-option>
    </el-select>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption } from 'element-plus'
import { FormFieldMode } from "@/components/form/types";
import { computed, inject, ref } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  value?: string
  options: object[]
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
})

const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (props.value) {
      const result = props.value?.split(',') || []
      console.log('multi select modelValue get', result);
      return result
    } else {
      return []
    }
  },
  set: v => {
    const value = v?.join(',') || ''
    console.log('multi select modelValue set', value);
    
    emits('update:value', value)
  }
})

const displayValue = computed(() => {
  let vals = []
  if (props.value) {
    vals = props.value.split(',')
  }
  const optionsMap = new Map(props.options.map(it => [it[props.valueField], it]))
  const display = vals.map(it => optionsMap.get(it)?.[props.labelField] || it).join(',')

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