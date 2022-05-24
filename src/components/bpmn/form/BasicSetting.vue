<template>
  <Process v-if="bpmnSelectedElem?.type === 'bpmn:Process'"></Process>
  <CommonNode v-if="bpmnSelectedElem?.type !== 'bpmn:Process'"></CommonNode>
</template>

<script lang="ts" setup>

import {inject} from "vue";
import {bpmnSelectedElemKey} from "@/config/app.keys";
import CommonNode from "@/components/bpmn/form/basic/CommonNode.vue";
import Process from "@/components/bpmn/form/basic/Process.vue";

const bpmnSelectedElem = inject(bpmnSelectedElemKey)


</script>

<style scoped>
* {
  font-size: 14px;
}


</style>