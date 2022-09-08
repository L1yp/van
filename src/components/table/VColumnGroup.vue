<template>
  <div>
    <slot v-bind="props"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

type Align = 'center' | 'left' | 'right'
interface Props {
  title?: string
  headerAlign?: Align
  headerClassName?: string
}

const props = defineProps<Props>()


const slots = useSlots()
console.log('col-group slots', slots);


</script>