<template>
  <div>666</div>
</template>

<script lang="ts" setup>

interface Props {
  instanceId: string
}

const props = defineProps<Props>()
console.log('instance page, instanceId', props.instanceId);

</script>