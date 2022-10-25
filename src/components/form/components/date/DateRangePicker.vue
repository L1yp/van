<template>
  <template v-if="cMode === 'design'">
    <el-date-picker v-model="val" :type="props.dateRangeType" disabled v-bind="$attrs" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-date-picker v-model="val" :type="props.dateRangeType" v-bind="$attrs"  />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElDatePicker } from 'element-plus'
import { computed, inject, nextTick } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  dateRangeType: DateRangeType
  value?: string[]
  defaultValue?: string[]
}

interface Emits {
  (e: 'update:value', v: string[]): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const val = computed<string[]>({
  get: () => {
    if (props.value) {
      return props.value
    }
    if (props.defaultValue) {
      nextTick(() => emits('update:value', props.defaultValue))
      return props.defaultValue
    }
    return []
  },
  set: v => emits('update:value', v)
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

const displayValue = computed(() => {
  if (val.value?.length === 2 && val.value[0] && val.value[1]) {
    return val.value[0] + ' ~ ' + val.value[1]
  }
  return ''
})

</script>

<style scoped>

</style>