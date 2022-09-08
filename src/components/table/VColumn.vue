<template>
  <div>
    <slot v-bind="props"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

type Align = 'center' | 'left' | 'right'
interface Props {
  field: string
  title: string
  width: string
  align?: Align
  headerAlign?: Align
  row?: any
  column?: any
}

const props = defineProps<Props>()


const slots = useSlots()

console.log('v-column slots', slots);


</script>