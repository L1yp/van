<template>
  <template v-if="cMode === 'design'">
    <el-input v-model="val" type="textarea" disabled v-bind="props.inputAreaProps" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-input v-model="val" type="textarea" v-bind="props.inputAreaProps"  />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="props.value"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="props.value"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus'
import { FormFieldMode, InputAreaProps } from "@/components/form/types";
import {computed, inject} from "vue";
import {formModeKey} from "@/components/form/state.key";

interface Props {
  mode: FormFieldMode
  value: string
  attrs: InputAreaProps
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const val = computed<string>({
  get: () => props.value,
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