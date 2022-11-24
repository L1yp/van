<template>
  <div>
    <VFormRender v-if="props.formData && props.scheme" v-bind="props" />
  </div>
  
</template>
<script lang="ts" setup>
import VFormRender from '@/components/form/designer/VFormRender.vue';

interface Props {
  scheme: VFormScheme | null
  formData: object | null
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>