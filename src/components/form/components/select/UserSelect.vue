<template>
  <template v-if="cMode === 'design'">
    <UserSelectorInput disabled :multiple="props.multiple" :placeholder="props.placeholder" v-model="val" />
  </template>
  <template v-else-if="cMode === 'edit'">
    <UserSelectorInput :multiple="props.multiple" :placeholder="props.placeholder" v-model="val" />
  </template>
  <template v-else-if="cMode === 'read' ">
    <div>
      <el-tag v-for="option in selectedElems" :key="option.id" v-text="option.nickname" ></el-tag>
    </div>
  </template>
  <template v-else>
    <div></div>
  </template>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick } from "vue";
import { formModeKey } from "@/components/form/state.key";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import { ElTag } from 'element-plus'
import { useUserMap } from "@/config/app.hooks";

interface Props {
  mode?: FormFieldMode
  value?: string
  defaultValue?: string
  multiple?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const userMap = useUserMap()

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (props.multiple) {
      if (props.value) {
        return props.value.split(',')
      }
      if (props.defaultValue) {
        const defaultValue = props.defaultValue
        nextTick(() => emits('update:value', defaultValue))
        return props.defaultValue?.split(',') || []
      }
      return []
    } else {
      if (props.value) {
        return props.value
      }
      if (props.defaultValue) {
        const defaultValue = props.defaultValue
        nextTick(() => emits('update:value', defaultValue))
        return props.defaultValue
      }
      return ''
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

const selectedElems = computed(() => {
  const userIds = props.value?.split(',') || []
  console.log('user select', userIds)
  return userIds.map(it => userMap.get(it)).filter(it => !!it)
})

// const displayValue = computed(() => {
//   const userIds = props.value?.split(',') || []
//   return userIds.map(it => userMap.get(it)?.nickname || it)?.join(', ')
// })

</script>

<style scoped>
span.el-tag + span.el-tag {
  margin-left: 6px;
}
</style>