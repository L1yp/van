<template>
  <template v-if="cMode === 'design'">
    <el-input-number :controls="false" v-model="val" disabled v-bind="$props" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-input-number :controls="false" v-model="val" v-bind="$props"  />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="props.value"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="props.value"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElInputNumber } from 'element-plus'
import { computed, inject, nextTick } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  value?: number
  defaultValue?: number
}

interface Emits {
  (e: 'update:value', v: number): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const val = computed<number>({
  get: () => {
    if (props.value) {
      return props.value
    }
    if (props.defaultValue) {
      nextTick(() => emits('update:value', props.defaultValue))
      return props.defaultValue
    }
    return 0
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

</script>

<style scoped>

</style>