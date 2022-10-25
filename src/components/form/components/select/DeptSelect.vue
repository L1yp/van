<template>
  <DeptSelectorInput v-show="cMode !== 'hidden'" :disabled="cMode === 'design'" :preview="cMode === 'read'" :multiple="props.multiple" :placeholder="props.placeholder" v-model="val"  />
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeMount, ref } from "vue";
import { formModeKey } from "@/components/form/state.key";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { useDeptInfo } from "@/service/system/dept";



interface Props {
  mode?: FormFieldMode
  value?: string
  multiple?: boolean
  placeholder?: string
  defaultValue?: string | string[]
}

interface Emits {
  (e: 'update:value', v: string | string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (props.multiple) {
      if (props.value) {
        return props.value.split(',')
      } else {
        if (props.defaultValue?.length) {
          nextTick(() => emits('update:value', props.defaultValue))
          return props.defaultValue
        }
        return []
      }
    } else {
      if (props.value) {
        return props.value
      }
      if (props.defaultValue) {
        nextTick(() => emits('update:value', props.defaultValue))
        return props.defaultValue
      }
      return ''
    }
  },
  set: v => {
    if (props.multiple) {
      if (Array.isArray(v)) {
        if (v.length) {
          const result = v?.join(',') || ''
          emits('update:value', result)
        } else {
          emits('update:value', '')
        }
      } else {
        console.error(`[error] multiple is true, but modelValue is not array`)
      }
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

</script>

<style scoped>

</style>