<template>
  <span v-text="props.value"></span>
</template>

<script lang="ts" setup>

interface Props {
  value: string
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>