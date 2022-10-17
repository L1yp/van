<template>
  <template v-if="cMode === 'design'">
    <el-input v-model="val" type="textarea" disabled v-bind="$props" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-input v-model="val" type="textarea" v-bind="$props"  />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="props.modelValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="props.modelValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus'
import { FormFieldMode } from "@/components/form/types";
import {computed, inject} from "vue";
import {formModeKey} from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const val = computed<string>({
  get: () => props.modelValue || '',
  set: v => emits('update:modelValue', v)
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