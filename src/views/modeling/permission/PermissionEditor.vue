<template>
  <div>
    <div>
      <el-button>取消</el-button>
      <el-button>确定</el-button>
    </div>
    <ExpressionEditor v-bind="$props" />
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from "element-plus";
import ExpressionEditor from "@/components/permission/editor/ExpressionEditor.vue";

interface Props {
  module: FieldModule
  mkey: string
}
const props = defineProps<Props>()

</script>

<style scoped>

</style>