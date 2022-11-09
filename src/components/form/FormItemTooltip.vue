<template>
  <div style="display: flex; align-items: center">
    <div>
      <span v-text="props.title"></span>
    </div>
    <div style="display: flex; align-items: center; margin-left: 6px;">
      <el-tooltip
        raw-content
        :effect="props.effect"
        :content="props.content"
        popper-class="form-item-tooltip"
      >
        <s-v-g-icon name="InfoFilled" style="width: 16px; height: 16px"></s-v-g-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SVGIcon from "@/components/common/SVGIcon.vue";
import { ElTooltip } from 'element-plus'

interface Props {
  title: string
  content: string
  effect?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  effect: 'dark'
})

</script>

<style scoped>

</style>