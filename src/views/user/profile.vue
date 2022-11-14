<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">

    <div style="width: 100%; flex: 1"></div>
    <Collapsed v-model="collapsed1" position="bottom">
      <div style="width: 100%; height: 100px; background-color: red;">6</div>
    </Collapsed>

  </div>
</template>

<script lang="ts" setup>
import { ref, } from "vue"
import Collapsed from "@/components/common/Collapsed.vue";

const collapsed1 = ref(false)
const collapsed2 = ref(false)
const collapsed3 = ref(false)

</script>

<style scoped>

</style>