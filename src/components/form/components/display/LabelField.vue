<template>
  <div v-text="props.value" :style="mergeStyle" ></div>
</template>

<script lang="ts" setup>
import { computed, inject, StyleValue } from "vue";

interface Props {
  value?: string
  fontSize?: number
  color?: string
  bgColor?: string
  align?: 'left' | 'right'
}

const props = defineProps<Props>()



const mergeStyle = computed<StyleValue>(() => {
  const style: StyleValue = {}
  props.fontSize && (style.fontSize = props.fontSize + 'px')
  props.color && (style.color = props.color)
  props.bgColor && (style.backgroundColor = props.bgColor)
  props.align && (style.textAlign = props.align)
  return style
})

</script>

<style scoped>

</style>