<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <VUpload ref="uploadRef" v-model:value="fileList" disabled />
  </div>

</template>

<script lang="ts" setup>
import { ref, } from "vue"
import Collapsed from "@/components/common/Collapsed.vue";
import VUpload from "@/components/form/components/VUpload.vue";
import type { UploadUserFile } from "element-plus";

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://gchat.qpic.cn/gchatpic_new/942664114/653405264-2223670402-25CE2E5D4F42377A6F1DDC82C9319132/0',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const width = '100px'
const height = '100px'

</script>

<style scoped>
.test {
  width: v-bind(width);
  height: v-bind(height);
  background-color: aqua;
}
</style>