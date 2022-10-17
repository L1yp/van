<template>
  <template v-if="cMode === 'design'">
    <UserSelectorInput disabled :multiple="props.multi" :placeholder="props.placeholder" v-model="val" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <UserSelectorInput :multiple="props.multi" :placeholder="props.placeholder" v-model="val" />
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
import { computed, inject } from "vue";
import { formModeKey } from "@/components/form/state.key";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import { userMapKey } from "@/config/app.keys";

interface Props {
  mode?: FormFieldMode
  modelValue?: string
  multi?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', v: string): void
}

const userMap = inject(userMapKey)

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (props.multi) {
      return props.modelValue?.split(',') || []
    } else {
      return props.modelValue || ''
    }
  },
  set: v => {
    if (props.multi) {
      emits('update:modelValue', (v as string[])?.join(',') || '')
    } else {
      emits('update:modelValue', v as string)
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

const displayValue = computed(() => {
  const userIds = props.modelValue?.split(',') || []
  return userIds.map(it => userMap.get(it)?.nickname || it).join(',')
})

</script>

<style scoped>

</style>