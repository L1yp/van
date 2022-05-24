<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId"/>
  </svg>
</template>
<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'

export default defineComponent({
  props: {
    name: String as PropType<string>
  },
  setup(props){
    const symbolId = computed(() => `#icon-${props.name}`)
    return {
      symbolId
    }
  }
})
</script>


