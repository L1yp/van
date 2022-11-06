<template>
  <el-date-picker
    v-model="val"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { ElDatePicker } from "element-plus";
import { computed } from "vue";

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', v: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed({
  get: () => {
    if (!props.modelValue || !props.modelValue.includes(',')) {
      return []
    }
    const times = props.modelValue.split(',')
    if (times?.length !== 2) {
      return []
    }
    return [new Date(parseInt(times[0])), new Date(parseInt(times[1]))]
  },
  set: v => {
    console.log('date range picker setter', v);
    if (v?.length === 2) {
      emits('update:modelValue', v[0].getTime() + ',' + v[1].getTime())
    } else {
      emits('update:modelValue', '')
    }

  }
})

</script>