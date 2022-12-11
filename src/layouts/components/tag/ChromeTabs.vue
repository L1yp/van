<template>
  <div class="tabs">
    <ChromeTab v-for="item in props.items" :title="item" />
  </div>
</template>

<script lang="ts" setup>
import {genId} from "@/components/form/designer/util/common";
import ChromeTab from "@/layouts/components/tag/ChromeTab.vue";

interface Props {
  items: string[]
}

const props = defineProps<Props>()

const id = genId()

</script>

<style>
* {
  box-sizing: border-box;
}

.tabs {
  height: 30px;
  display: flex;
}
</style>
