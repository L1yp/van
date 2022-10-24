<template>
  <template v-if="cMode === 'design'">
    <el-date-picker v-model="val" disabled v-bind="$attrs" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-date-picker v-model="val" v-bind="$attrs"  />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="props.value"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="props.value"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElDatePicker } from 'element-plus'
import { computed, inject } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  value?: string[]
}

interface Emits {
  (e: 'update:value', v: string[]): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const val = computed<string[]>({
  get: () => props.value || ['', ''],
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