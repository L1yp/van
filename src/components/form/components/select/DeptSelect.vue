<template>
  <template v-if="cMode === 'design'">
    <DeptSelectorInput disabled :multiple="props.multiple" :placeholder="props.placeholder" v-model="val"  />
  </template>
  <template v-else-if="cMode === 'edit'">
    <DeptSelectorInput :multiple="props.multiple" :placeholder="props.placeholder" v-model="val" />
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { FormFieldMode } from "@/components/form/types";
import { computed, inject, onBeforeMount, ref } from "vue";
import { formModeKey } from "@/components/form/state.key";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { useDeptInfo } from "@/service/system/dept";
import { findTreeItemById } from "@/utils/common";


interface Props {
  mode?: FormFieldMode
  value?: string
  multiple?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (props.multiple) {
      return props.value?.split(',') || []
    } else {
      return props.value || ''
    }
  },
  set: v => {
    if (props.multiple) {
      emits('update:value', (v as string[])?.join(',') || '')
    } else {
      emits('update:value', v as string)
    }
  }
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

const { tableData, loadDept } = useDeptInfo()
onBeforeMount(loadDept)

const displayValue = computed(() => {
  const userIds = props.value?.split(',') || []
  return userIds.map(it => findTreeItemById(tableData.value, 'id', it)?.title || it)?.join(', ')
})

</script>

<style scoped>

</style>