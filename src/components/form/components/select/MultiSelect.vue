<template>
  <template v-if="cMode === 'design'">
    <el-select v-model="val" multiple disabled v-bind="$props">
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
    <el-select v-model="val" multiple collapse-tags collapse-tags-tooltip v-bind="$props">
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
import { computed, inject } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  modelValue?: string
  options: object[]
  labelField?: string
  valueField?: string
  disabledField?: string
}

interface Emits {
  (e: 'update:modelValue', v: string): void
}

const props = withDefaults(defineProps<Props>(), {
  labelField: 'name',
  valueField: 'id',
  disabledField: 'disabled',
})

const emits = defineEmits<Emits>()

const val = computed({
  get: () => props.modelValue?.split(',') || [],
  set: v => emits('update:modelValue', v?.join(',') || '')
})

const displayValue = computed(() => {
  return props.options.find(it => it[props.valueField] === props.modelValue)?.[props.labelField] || ''
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