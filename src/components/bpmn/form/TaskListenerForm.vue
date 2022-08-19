
<template>

</template>

<script lang="ts" setup>

import {ref} from "vue";

interface ITaskListener {
  event: 'create' | 'assignment' | 'complete' | 'delete'
}

interface ClassTaskListener extends ITaskListener {
  class: string
}
interface ExpressionTaskListener extends ITaskListener {
  expression: string
}

type TaskListener = ClassTaskListener | ExpressionTaskListener

const data = ref()

// https://l1yp.com/docs/flowable/bpmn/#taskListeners
</script>

<style scoped>

</style>