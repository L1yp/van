<template>
  <template v-if="Object.prototype.hasOwnProperty.call(Icon, name)">
    <component :is="Icon[name]" />
  </template>
  <template v-else>
    <svg aria-hidden="true">
      <use :xlink:href="symbolId"/>
    </svg>
  </template>
</template>
<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import * as Icon from '@element-plus/icons-vue'



export default defineComponent({
  props: {
    name: String as PropType<string>
  },
  setup(props){
    const symbolId = computed<string>(() => `#icon-${props.name}`)
    return {
      symbolId, Icon
    }
  }
})
</script>


